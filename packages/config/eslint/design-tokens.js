// Design-system guardrail shared by every app (CLAUDE.md: "UI only from packages/ui and tokens").
// Bans raw hex/rgb/hsl colours and arbitrary Tailwind values such as `p-[13px]` or `bg-[#ff0000]`
// in string literals, template literals and JSX attribute strings.
// The only files allowed to contain raw values are the token sources in packages/ui
// (src/tokens.ts, generated from Figma variables), which disable this rule explicitly.

const HEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
const FN_COLOUR = /\b(?:rgb|rgba|hsl|hsla)\(/;
// e.g. "p-[13px]", "hover:bg-[#fff]", "w-[calc(100%-2rem)]", "-mt-[3px]"
const ARBITRARY_TW = /(?:^|[\s:"'`])-?[a-z][a-z0-9-]*-\[[^\]]+\]/;

function check(context, node, text) {
  if (typeof text !== 'string' || text.length === 0) return;
  if (HEX.test(text) || FN_COLOUR.test(text)) {
    context.report({ node, messageId: 'rawColour' });
  } else if (ARBITRARY_TW.test(text)) {
    context.report({ node, messageId: 'arbitraryTailwind' });
  }
}

const noRawDesignValues = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow raw colours and arbitrary Tailwind values; use design tokens.' },
    messages: {
      rawColour: 'Raw colours are banned. Use a colour token from @trackdesk/ui (tokens / Tailwind preset).',
      arbitraryTailwind:
        'Arbitrary Tailwind values are banned. Use the spacing/size/radius scale from the @trackdesk/ui preset.',
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        check(context, node, node.value);
      },
      TemplateElement(node) {
        check(context, node, node.value.raw);
      },
      JSXText(node) {
        // Text content may legitimately contain "#1" etc.; only check obvious hex colours.
        if (HEX.test(node.value) && /#[0-9a-fA-F]{6}\b/.test(node.value)) {
          context.report({ node, messageId: 'rawColour' });
        }
      },
    };
  },
};

export const designTokensPlugin = { rules: { 'no-raw-design-values': noRawDesignValues } };

/** @type {import('eslint').Linter.Config} */
export const designTokenRules = {
  plugins: { 'design-tokens': designTokensPlugin },
  rules: { 'design-tokens/no-raw-design-values': 'error' },
};

export default designTokenRules;
