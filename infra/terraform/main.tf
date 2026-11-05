# SECURITY-REVIEW-REQUIRED: DRAFT infrastructure — a human reviews and applies. AI never runs
# `terraform apply`. UK data residency: AWS eu-west-2 (London) only. Supabase projects (London
# region) are created by a human in the Supabase dashboard; their URLs/keys go to Secrets Manager.
terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.70" }
  }
  backend "s3" {
    # TODO(human): create the state bucket + lock table in eu-west-2 first.
    bucket       = "trackdesk-terraform-state"
    key          = "trackdesk/${terraform.workspace}.tfstate"
    region       = "eu-west-2"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region = "eu-west-2" # London — do not change (UK data residency, docs/01-nfr-targets.md)
  default_tags {
    tags = { project = "trackdesk", environment = var.environment, managed_by = "terraform" }
  }
}

variable "environment" {
  type = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be dev, staging or prod"
  }
}

variable "api_image_tag" {
  type        = string
  description = "Image tag of trackdesk-api in ECR (set by the release process)."
}

variable "api_desired_count" {
  type    = number
  default = 2
}

# --- Container registry ---------------------------------------------------------------------
resource "aws_ecr_repository" "api" {
  name                 = "trackdesk-api"
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration { scan_on_push = true }
}

# --- Secrets (values set by a human, never in Terraform state as plaintext) ----------------
locals {
  secret_names = [
    "DB_URL", "DB_APP_PASSWORD", "DB_OWNER_PASSWORD",
    "SUPABASE_URL", "SUPABASE_JWKS_URL", "SUPABASE_JWT_ISSUER", "SUPABASE_SERVICE_ROLE_KEY",
    "SENTRY_DSN",
  ]
}

resource "aws_secretsmanager_secret" "api" {
  for_each   = toset(local.secret_names)
  name       = "trackdesk/${var.environment}/api/${each.value}"
  kms_key_id = aws_kms_key.secrets.arn
}

resource "aws_kms_key" "secrets" {
  description         = "TrackDesk ${var.environment} secrets"
  enable_key_rotation = true
}

# --- Logs -----------------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "api" {
  name              = "/trackdesk/${var.environment}/api"
  retention_in_days = 30
}

# --- Compute (ECS Fargate) ------------------------------------------------------------------
# TODO(human): VPC, subnets, ALB + ACM certificate, security groups and the ECS service are
# sketched in modules/ecs-api (not yet written). Decide AWS vs GCP europe-west2 first (D-012).
module "api" {
  source        = "./modules/ecs-api"
  environment   = var.environment
  image         = "${aws_ecr_repository.api.repository_url}:${var.api_image_tag}"
  desired_count = var.api_desired_count
  log_group     = aws_cloudwatch_log_group.api.name
  secret_arns   = { for k, s in aws_secretsmanager_secret.api : k => s.arn }
  spring_profile = var.environment == "prod" ? "prod" : "staging"
}
