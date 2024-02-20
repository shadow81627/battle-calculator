import * as cheerio from 'cheerio'

interface BSCost {
  name?: string
  value?: string
}

interface BSCategory {
  id?: string
  name?: string
  primary?: boolean
}

interface BSAbility {
  name?: string
}

interface BSProfile {
  name?: string
}

interface BSSelection {
  id?: string
  name?: string
  type?: string
  costs: BSCost[]
  categories: BSCategory[]
  profiles: BSProfile[]
  abilities: BSAbility[]
  children: BSSelection[]
}

export default defineEventHandler(async () => {
  const data = await useStorage('assets:server').getItem('Crusade.ros')
  if (!data)
    throw createError({ message: 'Unable to get file', status: 400 })

  const $ = cheerio.load(data, {
    xmlMode: true,
    xml: {
      normalizeWhitespace: true,
    },
  })

  function parseSelection(selectionEntry) {
    const categories: BSCategory[] = []
    $(selectionEntry).find('> categories > category').each((index, categoryLink) => {
      categories.push({
        name: $(categoryLink).attr('name'),
        id: $(categoryLink).attr('id'),
        primary: $(categoryLink).attr('primary')?.toLowerCase?.() === 'true',
      })
    })

    const costs: BSCost[] = []
    $(selectionEntry).find('> costs > cost').each((index, item) => {
      costs.push({ value: $(item).attr('value'), name: $(item).attr('name') })
    })

    const profiles: BSProfile[] = []
    const abilities: BSAbility[] = []
    $(selectionEntry).find('> profiles > profile').each((index, profileElement) => {
      const profile = { name: $(profileElement).attr('name'), typeName: $(profileElement).attr('typeName') }
      $(profileElement).find('> characteristics > characteristic').each((index, characteristicElement) => {
        profile[$(characteristicElement).attr('name')] = $(characteristicElement).text()
      })
      if ($(profileElement).attr('typeName') === 'Abilities')
        abilities.push(profile)
      else
        profiles.push(profile)
    })

    const children: BSSelection[] = []
    $(selectionEntry).find('> selections > selection').each((index, childSelectionEntry) => {
      if ($(childSelectionEntry).attr('targetId')) {
        const targetElement = $(`#${$(childSelectionEntry).attr('targetId')}`)
        const child = parseSelection(targetElement)
        children.push(child)
      }
      else {
        const child = parseSelection(childSelectionEntry)
        children.push(child)
      }
    })

    return {
      id: $(selectionEntry).attr('id'),
      name: $(selectionEntry).attr('name'),
      type: $(selectionEntry).attr('type'),
      costs,
      categories,
      profiles,
      abilities,
      children,
    }
  }

  const selections: BSSelection[] = []
  $('selection').each((i, el) => {
    const selection = parseSelection(el)
    selections.push(selection)
  })
  return { data: selections }
})
