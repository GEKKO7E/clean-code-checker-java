export const analysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "overallScore",
    "qualityScore",
    "securityScore",
    "performanceScore",
    "maintainabilityScore",
    "issues",
    "suggestions",
    "complexity",
    "summary",
  ],
  properties: {
    overallScore: { type: "integer" },
    qualityScore: { type: "integer" },
    securityScore: { type: "integer" },
    performanceScore: { type: "integer" },
    maintainabilityScore: { type: "integer" },
    issues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["severity", "line", "title", "description", "category"],
        properties: {
          severity: {
            type: "string",
            enum: ["Critical", "High", "Medium", "Low"],
          },
          line: {
            anyOf: [{ type: "integer" }, { type: "null" }],
          },
          title: { type: "string" },
          description: { type: "string" },
          category: {
            type: "string",
            enum: ["Security", "Performance", "Bug", "Quality", "Maintainability", "Design"],
          },
        },
      },
    },
    suggestions: {
      type: "array",
      items: { type: "string" },
    },
    complexity: {
      type: "object",
      additionalProperties: false,
      required: ["estimatedLevel", "notes"],
      properties: {
        estimatedLevel: {
          type: "string",
          enum: ["Low", "Medium", "High", "Very High"],
        },
        notes: { type: "string" },
      },
    },
    summary: { type: "string" },
  },
} as const;
