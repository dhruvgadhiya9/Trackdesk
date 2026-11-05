# SECURITY-REVIEW-REQUIRED: DRAFT module — interface only; resources are TODO for the DevOps owner.
variable "environment" { type = string }
variable "image" { type = string }
variable "desired_count" { type = number }
variable "log_group" { type = string }
variable "secret_arns" { type = map(string) }
variable "spring_profile" { type = string }

# TODO(human): aws_ecs_cluster, aws_ecs_task_definition (cpu 1024 / memory 2048, port 8080,
# secrets from var.secret_arns, SPRING_PROFILES_ACTIVE = var.spring_profile, health check
# /actuator/health/readiness), aws_ecs_service behind an ALB (HTTPS only, TLS 1.2+), autoscaling
# on CPU 60 %, private subnets, egress only to Supabase + Sentry + providers.

output "note" {
  value = "ecs-api module is a draft; see TODO in main.tf"
}
