import cheerio from 'cheerio'

export default defineEventHandler(async () => {
  const data = await useStorage('assets:server').getItem('Imperium - Astra Militarum - Library.xml')
  if (!data)
    throw createError({ message: 'Unable to get file', status: 400 })

  const $ = cheerio.load(data, {
    xmlMode: true,
    xml: {
      normalizeWhitespace: true,
    },
  })

  // const attributeNames = {
  //   M: 'movement',
  //   T: 'toughness',
  //   SV: 'save',
  //   W: 'wound',
  //   LD: 'leadership',
  //   OC: 'control',
  // }

  function parseSelection(selectionEntry) {
    // const entry = {}
    const categories = []
    $(selectionEntry).find('> categoryLinks > categoryLink').each((index, categoryLink) => {
      categories.push({ name: $(categoryLink).attr('name'), id: $(categoryLink).attr('targetId') })
    })

    const costs = []
    $(selectionEntry).find('> costs > cost').each((index, item) => {
      costs.push({ value: $(item).attr('value'), name: $(item).attr('name') })
    })

    const profiles = []
    const abilities = []
    // const attributes = {};
    $(selectionEntry).find('> profiles > profile').each((index, profileElement) => {
      const profile = { name: $(profileElement).attr('name'), typeName: $(profileElement).attr('typeName') }
      $(profileElement).find('> characteristics > characteristic').each((index, characteristicElement) => {
        // if ($(profileElement).attr('typeName') === 'Unit')
        //   profile[$(characteristicElement).attr('name')] = $(characteristicElement).text().match(/\d+/)?.[0] || 0
        // else
        profile[$(characteristicElement).attr('name')] = $(characteristicElement).text()
      })
      if ($(profileElement).attr('typeName') === 'Abilities')
        abilities.push(profile)
      else
        profiles.push(profile)
    })

    const constraints = []
    $(selectionEntry).find('> constraints > constraint').each((index, constraintElement) => {
      const constraint = {
        type: $(constraintElement).attr('type'),
        value: $(constraintElement).attr('value'),
        id: $(constraintElement).attr('id'),
      }
      constraints.push(constraint)
    })

    const children = []
    $(selectionEntry).find('> selectionEntries > selectionEntry, > selectionEntry, > entryLinks > entryLink[type="selectionEntry"], > selectionEntry, > entryLinks > [type="selectionEntryGroup"], > selectionEntryGroups > selectionEntryGroup').each((index, childSelectionEntry) => {
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

    const selection = {
      id: $(selectionEntry).attr('id'),
      name: $(selectionEntry).attr('name'),
      type: $(selectionEntry).attr('type'),
      targetId: $(selectionEntry).attr('targetId'),
      categories,
      costs,
      profiles,
      abilities,
      children,
      constraints,
    }
    return selection
  }
  const selections = []
  $('sharedSelectionEntries > selectionEntry').each((index, selectionEntry) => {
    const selection = parseSelection(selectionEntry)
    if (!selection.name?.includes('[Legends]'))
      selections.push(selection)
  })

  // for (const entry of selections) {
  //   const folder = `data/selections/${entry.type}`
  //   await fs.mkdir(folder, { recursive: true })
  //   const filename = `${folder}/${slugify(entry.name)}.json`
  //   await fs.writeFile(filename, `${JSON.stringify(deepSort(entry), undefined, 2)}\n`, { flag: 'w' })
  // }

  return { data: selections }
})
