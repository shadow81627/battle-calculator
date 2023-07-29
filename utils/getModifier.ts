export default function getModifier(name: string, modifiers: { name: string }[]) {
  return modifiers?.find(modifier =>
    modifier.name.toUpperCase() === name.toUpperCase()
    || modifier.name.startsWith(name),
  )
}
