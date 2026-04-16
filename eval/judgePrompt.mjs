export function buildJudgeMessages({ caseDef, assistantOutput, knowledgeText }) {
  const system = `你是一个严格的对话评测员（LLM Judge）。你必须只依据以下信息评审：\n- 该用例的要求（must_include / must_not_include / expected_behavior）\n- 给定的知识库文本（knowledge）\n\n禁止：\n- 编造知识库里不存在的事实\n- 用常识替代证据\n\n你必须输出严格 JSON（不要 markdown，不要多余文字）：\n{\n  \"overall\": 0-10,\n  \"factuality\": 0-10,\n  \"style\": 0-10,\n  \"format\": 0-10,\n  \"rationale\": \"<=200字\"\n}\n\n评分要点：\n- factuality：硬事实是否只来自 knowledge，是否有幻觉/越界\n- format：是否符合 expected_behavior（尤其 --- 分隔）\n- style：是否像私信聊天、是否过度公文\n- overall：综合\n`;

  const user = `【用例】\n${JSON.stringify(
    {
      id: caseDef.id,
      category: caseDef.category,
      expected_behavior: caseDef.expected_behavior,
      must_include: caseDef.must_include ?? [],
      must_not_include: caseDef.must_not_include ?? [],
      user_input: caseDef.user_input,
    },
    null,
    2
  )}\n\n【模型输出】\n${assistantOutput}\n\n【knowledge】\n${knowledgeText}\n`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

