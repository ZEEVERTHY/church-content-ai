import OpenAI from 'openai'

// DIRECT API KEY - REPLACE WITH YOUR ACTUAL KEY FROM OPENAI
const DIRECT_API_KEY = process.env.OPENAI_API_KEY || ''

console.log('=== FORCE UPDATE DEBUG ===')
console.log('Direct key set:', !!DIRECT_API_KEY)
console.log('Key ends with:', DIRECT_API_KEY?.slice(-4))
console.log('===============================')

const openai = new OpenAI({
  apiKey: DIRECT_API_KEY,
})

export async function generateSermon(topic, verse, style = 'conversational', length = 'medium') {
  try {
    console.log('🔄 Starting sermon generation...')
    console.log('Using API key ending with:', DIRECT_API_KEY.slice(-4))

    // Enhanced pastoral system prompt
    const pastoralSystemPrompt = `You are an experienced, caring pastor who has walked alongside people through their deepest struggles and greatest joys. Your sermons connect Biblical truth with real human experiences in a way that touches hearts and transforms lives.

TONE & APPROACH:
- Speak as if you're having a warm conversation with someone you care about
- Use "we" and "us" to include yourself in the human experience
- Share wisdom like a trusted friend, not like a professor
- Address real struggles: doubt, fear, loneliness, purpose, relationships, work stress
- Balance gentle compassion with bold truth

STRUCTURE REQUIREMENTS:
1. WARM OPENING: Start with a relatable scenario, question, or story that draws people in
2. SCRIPTURE CONNECTION: Explain the Bible passage in everyday language, showing its relevance to modern life
3. MAIN POINTS: 2-3 key takeaways with practical applications and real-life examples
4. ILLUSTRATIONS: Include stories, analogies, or scenarios people can relate to
5. HEART CONNECTION: Address emotions and spiritual needs, not just information
6. CALL TO ACTION: End with specific, doable steps and encouragement

AVOID:
- Theological jargon without explanation
- Academic or preachy tone
- Abstract concepts without practical application
- Condemnation or judgment
- Generic platitudes

INCLUDE:
- Personal pronouns (we, us, you)
- Modern illustrations (workplace, family, technology, current struggles)
- Questions that make people think
- Hope and encouragement
- Specific, practical applications`

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

    const selectedStyle = stylePrompts[style] || stylePrompts.conversational

    const userPrompt = `${selectedStyle}

SERMON DETAILS:
- Topic: ${topic}
${verse ? `- Scripture: ${verse}` : '- Scripture: (No specific verse provided - create a sermon based on the topic)'}
- Target Length: ${currentLength.description}

Please create a sermon that:
1. Opens with a relatable story or scenario that connects to ${topic}
${verse ? `2. Explores ${verse} in an accessible, meaningful way` : '2. Draws from relevant Biblical principles and stories that connect to the topic'}
3. Addresses how this applies to real struggles people face today
4. Includes practical examples and illustrations
5. Ends with hope and actionable steps

Remember: This should sound like something a caring pastor would actually say to their congregation - warm, personal, and deeply relevant to their lives. Avoid sounding robotic, academic, or overly formal.`

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

    console.log('✅ Sermon generated successfully!')
    
    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: completion.usage
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    return {
      success: false,
      error: `Failed: ${error.message}`
    }
  }
}

export async function generateOutline(topic, targetAudience = 'adults', duration = '45 minutes') {
  try {
    console.log('🔄 Starting outline generation...')
    console.log('Using API key ending with:', DIRECT_API_KEY.slice(-4))

    const enhancedSystemPrompt = `You are a skilled Bible study leader who creates engaging, life-changing study experiences. Your outlines help people connect with Scripture on a personal level and apply Biblical truth to their daily lives.

PRINCIPLES:
- Make Bible study interactive and discussion-heavy
- Connect ancient text to modern life
- Create safe spaces for honest questions and vulnerability
- Balance teaching with personal application
- Include practical takeaways people can use this week

TONE:
- Welcoming and inclusive
- Encouraging questions and different perspectives  
- Practical and applicable
- Spiritually deep but accessible`

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

    console.log('✅ Outline generated successfully!')
    
    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: completion.usage
    }
  } catch (error) {
    console.error('❌ Outline Error:', error.message)
    return {
      success: false,
      error: `Failed: ${error.message}`
    }
  }
}

export async function rewriteContent(originalContent, newStyle = 'more engaging', instructions = '') {
  try {
    console.log('🔄 Starting content rewrite...')
    
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

    console.log('✅ Content rewritten successfully!')
    
    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: completion.usage
    }
  } catch (error) {
    console.error('❌ Rewrite Error:', error.message)
    return {
      success: false,
      error: `Failed: ${error.message}`
    }
  }
}