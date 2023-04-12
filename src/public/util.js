export const formatDateTime = (currentDate, lang = "pt-BR") => {
  const date = new Date(currentDate)

  const timeZone = new Intl.Locale(lang).timeZone

  return new Intl.DateTimeFormat(lang, { 
    dateStyle: 'short', 
    timeStyle: 'long', 
    timeZone: timeZone
  }).format(date)
}
