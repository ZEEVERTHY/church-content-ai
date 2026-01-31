import OpenAI from 'openai'
import { serverLog, serverError } from './logger'

// DIRECT API KEY - REPLACE WITH YOUR ACTUAL KEY FROM OPENAI
const DIRECT_API_KEY = process.env.OPENAI_API_KEY || ''

// Validate API key on module load
if (!DIRECT_API_KEY && typeof window === 'undefined') {
  serverError('⚠️  OPENAI_API_KEY is not set! Content generation will fail.')
}

const openai = new OpenAI({
  apiKey: DIRECT_API_KEY,
})

export async function generateSermon(topic, verse, style = 'conversational', length = 'medium', options = {}) {
  try {
    if (!DIRECT_API_KEY) {
      throw new Error('OpenAI API key is not configured')
    }
    
    serverLog('🔄 Starting sermon generation...', { topic, verse, style, length })

    // SYSTEM PROMPT — SERMON GENERATION ENGINE
    const pastoralSystemPrompt = `You are an AI Sermon Assistant built exclusively to help Christian pastors and ministry leaders create biblically sound, culturally relevant, and pastor-ready sermons and Bible study outlines.

Your role is NOT to replace the pastor's voice, theology, or authority. 
Your role is to STRUCTURE, CLARIFY, and EXPAND the pastor's intent into a clear, Spirit-led message.

CORE PRINCIPLES:
1. Scripture is authoritative and central.
2. Theology must be sound, balanced, and non-sensational.
3. Tone must be pastoral, reverent, encouraging, and practical.
4. Language must be clear, conversational, and suitable for spoken delivery.
5. Cultural illustrations should reflect everyday African life when enabled (family, work, waiting, faith, perseverance, church life).
6. Avoid prosperity-gospel extremes, fear-based manipulation, or speculative doctrine.
7. Never invent Bible verses or misquote Scripture.

INPUT YOU WILL RECEIVE:
- Creation Type (Sermon or Bible Study)
- Theme or Burden (free text from pastor)
- Audience Type
- Teaching Style (Narrative or Expository)
- Cultural Context Toggle (African or General)
- Main Scripture (optional)
- Additional Notes (optional)

BEHAVIOR RULES:
- If no scripture is provided, suggest a relevant main passage before proceeding.
- If scripture is provided, build the message faithfully around it.
- Do not generate content until the structure is clear.
- Maintain logical flow and spiritual coherence.
- Do not include disclaimers, AI mentions, or meta commentary.

OUTPUT STRUCTURE (STRICT — DO NOT CHANGE):

# TITLE
(Short, memorable, sermon-ready)

## PRIMARY SCRIPTURE
(Book, chapter, verses)

## INTRODUCTION
- Connect the theme to real-life experience
- State the spiritual tension or problem
- Briefly preview the message direction

## BIBLICAL CONTEXT
- Historical and situational background
- Who is speaking, to whom, and why

## EXEGETICAL INSIGHTS
- Explain key words, phrases, or ideas in the passage
- Keep language simple and pastor-friendly

## SERMON POINTS
### Point 1: (Clear, memorable statement)
- Explanation grounded in Scripture
- Illustration (culturally relevant if enabled)

### Point 2:
- Explanation
- Illustration

### Point 3 (if appropriate):
- Explanation
- Illustration

## PRACTICAL APPLICATION
- How this truth applies to daily Christian living
- Address faith, character, and obedience
- Speak to the chosen audience context

## CONCLUSION
- Re-emphasize the core message
- Offer hope and spiritual encouragement
- Prepare hearts for response

## CLOSING PRAYER (OPTIONAL BUT RECOMMENDED)
- Short, sincere, and aligned with the message

STYLE CONSTRAINTS:
- Avoid academic jargon.
- Avoid excessive length.
- Write as if the pastor will preach this aloud.
- Use respectful, pastoral language.
- Keep Christ-centered focus.

FAIL-SAFES:
- If user input is vague, ask one clarifying question only.
- If a request violates biblical integrity, gently redirect.
- Never fabricate theology or scripture.`

    // Determine length parameters
    const lengthSpecs = {
      short: { maxTokens: 800, description: "10-12 minute sermon" },
      medium: { maxTokens: 1200, description: "15-18 minute sermon" },
      long: { maxTokens: 1800, description: "20-25 minute sermon" }
    }

    const currentLength = lengthSpecs[length] || lengthSpecs.medium

    // Enhanced user prompt based on style
    const stylePrompts = {
      conversational: `Create a warm, conversational sermon that feels like a heart-to-heart talk with a trusted friend.`,
      encouraging: `Create an uplifting, hope-filled sermon that speaks to those who are discouraged or struggling.`,
      practical: `Create a practical, application-focused sermon that gives concrete steps for living out faith.`,
      evangelistic: `Create a compelling sermon that introduces people to God's love and the Gospel message.`,
      teaching: `Create an insightful teaching sermon that helps people understand Biblical truth in a fresh way.`
    }

    // Use teachingStyle from options, fallback to style parameter
    const selectedStyle = stylePrompts[options.teachingStyle || style] || stylePrompts.conversational

    // Build structure instructions based on teaching style
    const structureInstructions = options.teachingStyle === 'narrative' 
      ? `STRUCTURE: Create a NARRATIVE-DRIVEN sermon with a flowing theme:
- Define a central theme/story that runs throughout
- Introduction sets up the narrative
- Each point advances the story naturally
- Conclusion resolves the narrative with a clear call to action
- The sermon should feel like one cohesive story, not separate points`
      : `STRUCTURE: Create a STANDARD OUTLINE sermon with clear points:
- Introduction that draws people in
- 2-3 main points with clear transitions
- Each point stands on its own but connects to the theme
- Conclusion that ties everything together`

    // Standard biblical depth (not user-configurable per spec)
    const biblicalDepthInstructions = 'Include 3-5 scripture references with explanations. Reference relevant Bible stories and characters as illustrations.'

    // Build cultural context instructions (spec requirement)
    const culturalContextInstructions = {
      global: 'Use examples and illustrations that are relatable globally. Avoid region-specific references.',
      african: 'Use examples relevant to African church life: communal culture, extended family dynamics, church community, local economic challenges, faith under pressure, traditional values meeting modern life. Reference African church experiences and struggles.',
      nigerian: 'Use examples specific to Nigerian church context: Nigerian family structures, church life in Nigeria, economic realities, youth challenges, leadership in Nigerian churches, cultural values. Make it feel authentically Nigerian.'
    }[options.culturalContext || 'global']

    // Standard application focus (not user-configurable per spec)
    const applicationFocusInstructions = 'Focus applications on personal spiritual growth, individual faith journey, personal struggles and victories, while also addressing family, community, and church contexts when relevant.'

    // Build audience instructions (spec requirement)
    const audienceInstructions = {
      youth: 'Tailor the language and examples to resonate with a youth audience (teenagers to young adults).',
      adults: 'Tailor the language and examples to resonate with a general adult congregation.',
      mixed: 'Use language and examples that appeal to a mixed congregation, including youth and adults.'
    }[options.audience || 'adults']

    // Build tone instructions (spec requirement)
    const toneInstructions = {
      encouraging: `Maintain an encouraging and uplifting tone throughout.`,
      corrective: `Adopt a gentle but firm corrective tone, guiding towards biblical truth.`,
      prophetic: `Speak with a bold, challenging, and visionary prophetic tone.`
    }[options.tone || 'encouraging']

    const creationType = 'Sermon'
    const audienceLabel = (options.audience === 'youth'
      ? 'Youth'
      : options.audience === 'mixed'
      ? 'Mixed'
      : 'Adults')
    const teachingStyleLabel = (options.teachingStyle === 'expository'
      ? 'Expository'
      : options.teachingStyle === 'narrative'
      ? 'Narrative'
      : 'Teaching')
    const culturalLabel = (options.culturalContext === 'african'
      ? 'African'
      : options.culturalContext === 'nigerian'
      ? 'Nigerian'
      : 'General')

    const userPrompt = `
User wants to create a ${creationType.toUpperCase()}.

User message:
"${topic}"

Additional preferences:
Audience: ${audienceLabel}
Teaching style: ${teachingStyleLabel}
Cultural context: ${culturalLabel}

Follow the required sermon structure exactly.

Creation Type: ${creationType.toUpperCase()}

Theme / Burden:
${topic}

Audience:
${audienceLabel}

Teaching Style:
${teachingStyleLabel}
(Narrative or Expository)

Cultural Context:
${culturalLabel}
(African / Nigerian or General)

Primary Scripture:
${verse || 'None provided'}

Additional Instructions:
Target length: ${currentLength.description}

Instructions:
Create a complete ${creationType.toUpperCase()} following the required structure.
Ensure the message is biblically accurate, pastor-ready, and easy to preach or teach.
If African context is enabled, draw illustrations and applications from everyday African life and church experience.

--------------------
ADDITIONAL GENERATION GUIDANCE (DO NOT TREAT AS OUTPUT HEADINGS):

Writing Style:
- ${selectedStyle}
- ${toneInstructions}
- ${audienceInstructions}

Structure Emphasis:
${structureInstructions}

Biblical Support Emphasis:
${biblicalDepthInstructions}

Cultural & Contextual Relevance Emphasis:
${culturalContextInstructions}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Upgraded to GPT-4 for better quality
      messages: [
        {
          role: "system",
          content: pastoralSystemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: currentLength.maxTokens,
      temperature: 0.8, // Slightly higher for more natural, less robotic output
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    serverLog('✅ Sermon generated successfully!', { 
      tokens: completion.usage?.total_tokens 
    })
    
    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: completion.usage
    }
  } catch (error) {
    serverError('❌ Sermon generation error:', error.message)
    return {
      success: false,
      error: `Failed to generate sermon: ${error.message}`
    }
  }
}

/**
 * Regenerate a specific section of a sermon
 * @param {string} section - Section to regenerate: 'introduction', 'illustrations', 'application', 'points', 'full'
 * @param {object} originalSermon - Full original sermon content (markdown)
 * @param {object} originalInputs - Original generation inputs (topic, verse, options)
 * @param {string} additionalNote - Optional note from user (e.g., "Make this more practical for young adults")
 */
export async function regenerateSermonSection(section, originalSermon, originalInputs, additionalNote = '') {
  try {
    if (!DIRECT_API_KEY) {
      throw new Error('OpenAI API key is not configured')
    }

    serverLog(`🔄 Regenerating sermon section: ${section}`, { originalInputs })

    const sectionPrompts = {
      introduction: `Regenerate ONLY the Introduction section of this sermon.
Keep the title, scripture, sermon points, and overall message unchanged.
Make the introduction engaging, pastoral, and relevant to the chosen audience.
${additionalNote ? `Additional instruction: ${additionalNote}` : ''}`,

      illustrations: `Regenerate ONLY the illustrations under each sermon point.
Do not change the sermon points, explanations, or theology.
Use culturally relevant, everyday examples that fit the context.
${additionalNote ? `Additional instruction: ${additionalNote}` : ''}`,

      application: `Regenerate ONLY the Practical Application section.
Ensure applications are concrete, actionable, and suitable for daily Christian living.
Do not modify any other part of the sermon.
${additionalNote ? `Additional instruction: ${additionalNote}` : ''}`,

      points: `Regenerate the Sermon Points section.
Keep the same scripture, theme, and teaching style.
Ensure the points flow logically and are easy to remember.
Do not regenerate the introduction or conclusion.
${additionalNote ? `Additional instruction: ${additionalNote}` : ''}`,

      full: `Regenerate the entire sermon using the same inputs and structure,
but improve clarity, flow, and pastoral tone.
${additionalNote ? `Additional instruction: ${additionalNote}` : ''}`
    }

    const sectionPrompt = sectionPrompts[section] || sectionPrompts.full

    const regenerationPrompt = `Here is the existing sermon content:

${originalSermon}

---

Task:
${sectionPrompt}

Original Inputs:
- Topic: ${originalInputs.topic}
- Scripture: ${originalInputs.verse || 'None provided'}
- Audience: ${originalInputs.audience || 'Adults'}
- Teaching Style: ${originalInputs.teachingStyle || 'Narrative'}
- Cultural Context: ${originalInputs.culturalContext || 'Global'}
- Tone: ${originalInputs.tone || 'Encouraging'}

CRITICAL: 
- Maintain biblical accuracy and theological soundness
- Keep the same overall theme and message
- Only regenerate the specified section(s)
- Return the COMPLETE sermon with the regenerated section(s) updated
- Follow the exact output structure from the system prompt`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI Sermon Assistant. Your role is to help pastors refine their sermons by regenerating specific sections while maintaining the overall message, theology, and structure.

When regenerating a section:
1. Keep all other sections EXACTLY as they are
2. Only modify the specified section(s)
3. Maintain consistency with the original theme and tone
4. Ensure the regenerated section flows naturally with the rest of the sermon
5. Return the COMPLETE sermon, not just the regenerated section`
        },
        {
          role: "user",
          content: regenerationPrompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    serverLog(`✅ Section regenerated successfully: ${section}`, {
      tokens: completion.usage?.total_tokens
    })

    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: completion.usage
    }
  } catch (error) {
    serverError(`❌ Section regeneration error: ${error.message}`)
    return {
      success: false,
      error: `Failed to regenerate section: ${error.message}`
    }
  }
}

export async function generateOutline(topic, targetAudience = 'adults', duration = '45 minutes') {
  try {
    if (!DIRECT_API_KEY) {
      throw new Error('OpenAI API key is not configured')
    }
    
    serverLog('🔄 Starting outline generation...', { topic, targetAudience, duration })

    const enhancedSystemPrompt = `You are a skilled Bible study leader who creates engaging, life-changing study experiences. Your outlines help people connect with Scripture on a personal level and apply Biblical truth to their daily lives.

CRITICAL: You MUST format your response in a clear, structured way that pastors can easily read and use. Use clear headings and sections.

PRINCIPLES:
- Make Bible study interactive and discussion-heavy
- Connect ancient text to modern life
- Create safe spaces for honest questions and vulnerability
- Balance teaching with personal application
- Include practical takeaways people can use this week
- Do NOT sound like ChatGPT or use AI-y phrases

TONE:
- Welcoming and inclusive
- Encouraging questions and different perspectives  
- Practical and applicable
- Spiritually deep but accessible

REQUIRED STRUCTURE (MUST FOLLOW THIS FORMAT):

# [BIBLE STUDY TOPIC]

## Key Scripture(s)
[Primary Bible passages with book, chapter, and verse]

## Background / Context
[Simple explanation of the historical and biblical context]

## Discussion Points

### Question 1
[Thought-provoking question with guidance for discussion]

### Question 2
[Question that connects Scripture to real life]

### Question 3
[Question that encourages honest dialogue]

### Question 4
[Question addressing different life stages/situations]

### Question 5
[Question for personal reflection]

## Life Application
[3 main takeaways and specific ways to apply this week]

## Closing Thought
[Encouragement and preview for continued growth]`

    const prompt = `Create a comprehensive Bible study outline for:

STUDY DETAILS:
Topic: ${topic}
Target Audience: ${targetAudience}
Duration: ${duration}

STRUCTURE YOUR OUTLINE:

🌟 **WELCOME & OPENING** (5 minutes)
- Warm welcome and brief check-in
- Opening prayer focused on learning and growth
- Icebreaker question related to ${topic}

📖 **SCRIPTURE EXPLORATION** (15-20 minutes)
- Primary Bible passages (include 3-4 key verses)
- Context and background (in simple terms)
- Key themes and meanings

💬 **DISCUSSION QUESTIONS** (15-20 minutes)
Create 5-6 thought-provoking questions that:
- Help people share personal experiences
- Connect Scripture to real life
- Encourage honest dialogue
- Address different life stages/situations

🎯 **PRACTICAL APPLICATION** (10 minutes)
- 3 main takeaways from today's study
- Specific ways to apply this week
- Address common obstacles or challenges

🤔 **PERSONAL REFLECTION** (5 minutes)
- Individual reflection questions
- Journaling prompts
- Personal prayer time

📝 **WEEKLY CHALLENGE** (2 minutes)
- One specific action step for the week
- Accountability suggestion
- Encouragement for growth

🙏 **CLOSING** (3-5 minutes)
- Prayer requests related to the topic
- Group prayer or blessing
- Preview of next week

Make this outline feel warm, engaging, and practical for ${targetAudience}. Include specific Bible verses and ensure discussions will lead to real spiritual growth and life application.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Upgraded model
      messages: [
        {
          role: "system",
          content: enhancedSystemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    serverLog('✅ Outline generated successfully!', { 
      tokens: completion.usage?.total_tokens 
    })
    
    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: completion.usage
    }
  } catch (error) {
    serverError('❌ Outline generation error:', error.message)
    return {
      success: false,
      error: `Failed to generate outline: ${error.message}`
    }
  }
}

export async function rewriteContent(originalContent, newStyle = 'more engaging', instructions = '') {
  try {
    if (!DIRECT_API_KEY) {
      throw new Error('OpenAI API key is not configured')
    }
    
    serverLog('🔄 Starting content rewrite...', { style: newStyle })
    
    const rewriteSystemPrompt = `You are a skilled editor who helps pastors refine their sermons and Bible studies. You maintain the original spiritual message while improving clarity, engagement, and connection with the audience.

PRINCIPLES:
- Preserve all Biblical truth and core messages
- Enhance relatability and emotional connection
- Improve flow and readability
- Add practical applications where appropriate
- Maintain the author's authentic voice while making it more engaging`

    const styleInstructions = {
      'more engaging': 'Make this content more engaging and relatable while maintaining its spiritual depth. Add stories, questions, or examples that draw readers in.',
      'more conversational': 'Rewrite this in a warm, conversational tone as if speaking directly to someone you care about.',
      'more practical': 'Focus on practical applications and concrete ways people can live out these Biblical principles.',
      'more encouraging': 'Emphasize hope, encouragement, and God\'s love while addressing the content.',
      'simpler language': 'Simplify the language and concepts while maintaining the spiritual message, making it accessible to all audiences.'
    }

    const selectedInstruction = styleInstructions[newStyle] || newStyle

    const userPrompt = `Please rewrite the following content with this goal: ${selectedInstruction}

${instructions ? `Additional instructions: ${instructions}` : ''}

ORIGINAL CONTENT:
${originalContent}

REWRITE REQUIREMENTS:
- Keep all Biblical references and core spiritual messages intact
- Make it sound natural and human, not robotic
- Ensure it connects with real human experiences
- Maintain appropriate length and structure
- Focus on touching hearts, not just conveying information`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: rewriteSystemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    serverLog('✅ Content rewritten successfully!', { 
      tokens: completion.usage?.total_tokens 
    })
    
    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: completion.usage
    }
  } catch (error) {
    serverError('❌ Content rewrite error:', error.message)
    return {
      success: false,
      error: `Failed to rewrite content: ${error.message}`
    }
  }
}