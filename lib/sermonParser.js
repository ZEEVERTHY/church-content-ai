/**
 * Sermon Parser Utility
 * Parses markdown sermon output into structured sections for regeneration
 */

export function parseSermonSections(markdownContent) {
  if (!markdownContent || typeof markdownContent !== 'string') {
    return null
  }

  const sections = {
    title: '',
    primary_scripture: '',
    introduction: '',
    biblical_context: '',
    exegetical_insights: '',
    points: [],
    application: '',
    conclusion: '',
    closing_prayer: ''
  }

  // Split by major headings (##)
  const lines = markdownContent.split('\n')
  let currentSection = null
  let currentPoint = null
  let buffer = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Title (first # heading)
    if (line.startsWith('# ') && !sections.title) {
      sections.title = line.replace(/^#\s+/, '')
      continue
    }

    // Primary Scripture
    if (line.match(/^##\s+(PRIMARY\s+)?SCRIPTURE/i)) {
      currentSection = 'primary_scripture'
      buffer = []
      continue
    }

    // Introduction
    if (line.match(/^##\s+INTRODUCTION/i)) {
      if (currentSection === 'primary_scripture' && buffer.length > 0) {
        sections.primary_scripture = buffer.join('\n').trim()
      }
      currentSection = 'introduction'
      buffer = []
      continue
    }

    // Biblical Context
    if (line.match(/^##\s+BIBLICAL\s+CONTEXT/i)) {
      if (currentSection === 'introduction' && buffer.length > 0) {
        sections.introduction = buffer.join('\n').trim()
      }
      currentSection = 'biblical_context'
      buffer = []
      continue
    }

    // Exegetical Insights
    if (line.match(/^##\s+EXEGETICAL\s+INSIGHTS/i)) {
      if (currentSection === 'biblical_context' && buffer.length > 0) {
        sections.biblical_context = buffer.join('\n').trim()
      }
      currentSection = 'exegetical_insights'
      buffer = []
      continue
    }

    // Sermon Points
    if (line.match(/^##\s+SERMON\s+POINTS/i)) {
      if (currentSection === 'exegetical_insights' && buffer.length > 0) {
        sections.exegetical_insights = buffer.join('\n').trim()
      }
      currentSection = 'points'
      buffer = []
      continue
    }

    // Individual Point (###)
    if (line.match(/^###\s+Point\s+\d+:/i) || line.match(/^###\s+[IVX]+\./i)) {
      if (currentPoint && buffer.length > 0) {
        currentPoint.content = buffer.join('\n').trim()
        sections.points.push(currentPoint)
      }
      currentPoint = {
        title: line.replace(/^###\s+/, ''),
        content: '',
        illustration: ''
      }
      buffer = []
      continue
    }

    // Practical Application
    if (line.match(/^##\s+PRACTICAL\s+APPLICATION/i)) {
      if (currentPoint && buffer.length > 0) {
        currentPoint.content = buffer.join('\n').trim()
        sections.points.push(currentPoint)
        currentPoint = null
      }
      currentSection = 'application'
      buffer = []
      continue
    }

    // Conclusion
    if (line.match(/^##\s+CONCLUSION/i)) {
      if (currentSection === 'application' && buffer.length > 0) {
        sections.application = buffer.join('\n').trim()
      }
      currentSection = 'conclusion'
      buffer = []
      continue
    }

    // Closing Prayer
    if (line.match(/^##\s+CLOSING\s+PRAYER/i)) {
      if (currentSection === 'conclusion' && buffer.length > 0) {
        sections.conclusion = buffer.join('\n').trim()
      }
      currentSection = 'closing_prayer'
      buffer = []
      continue
    }

    // Accumulate content for current section
    if (line && !line.match(/^#{1,3}\s+/)) {
      buffer.push(line)
    }
  }

  // Finalize last section
  if (currentSection === 'primary_scripture' && buffer.length > 0) {
    sections.primary_scripture = buffer.join('\n').trim()
  } else if (currentSection === 'introduction' && buffer.length > 0) {
    sections.introduction = buffer.join('\n').trim()
  } else if (currentSection === 'biblical_context' && buffer.length > 0) {
    sections.biblical_context = buffer.join('\n').trim()
  } else if (currentSection === 'exegetical_insights' && buffer.length > 0) {
    sections.exegetical_insights = buffer.join('\n').trim()
  } else if (currentPoint && buffer.length > 0) {
    currentPoint.content = buffer.join('\n').trim()
    sections.points.push(currentPoint)
  } else if (currentSection === 'application' && buffer.length > 0) {
    sections.application = buffer.join('\n').trim()
  } else if (currentSection === 'conclusion' && buffer.length > 0) {
    sections.conclusion = buffer.join('\n').trim()
  } else if (currentSection === 'closing_prayer' && buffer.length > 0) {
    sections.closing_prayer = buffer.join('\n').trim()
  }

  return sections
}

/**
 * Reconstructs markdown from structured sections
 */
export function reconstructMarkdown(sections) {
  if (!sections || typeof sections !== 'object') {
    return ''
  }

  let markdown = ''

  if (sections.title) {
    markdown += `# ${sections.title}\n\n`
  }

  if (sections.primary_scripture) {
    markdown += `## PRIMARY SCRIPTURE\n${sections.primary_scripture}\n\n`
  }

  if (sections.introduction) {
    markdown += `## INTRODUCTION\n${sections.introduction}\n\n`
  }

  if (sections.biblical_context) {
    markdown += `## BIBLICAL CONTEXT\n${sections.biblical_context}\n\n`
  }

  if (sections.exegetical_insights) {
    markdown += `## EXEGETICAL INSIGHTS\n${sections.exegetical_insights}\n\n`
  }

  if (sections.points && sections.points.length > 0) {
    markdown += `## SERMON POINTS\n\n`
    sections.points.forEach((point, index) => {
      markdown += `### Point ${index + 1}: ${point.title}\n${point.content}\n\n`
      if (point.illustration) {
        markdown += `${point.illustration}\n\n`
      }
    })
  }

  if (sections.application) {
    markdown += `## PRACTICAL APPLICATION\n${sections.application}\n\n`
  }

  if (sections.conclusion) {
    markdown += `## CONCLUSION\n${sections.conclusion}\n\n`
  }

  if (sections.closing_prayer) {
    markdown += `## CLOSING PRAYER\n${sections.closing_prayer}\n\n`
  }

  return markdown.trim()
}
