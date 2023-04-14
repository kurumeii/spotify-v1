const getDayNight = () => {
  const hours = new Date().getHours() //24Hr format exp: 21:00 means 9PM
  return hours < 12
    ? 'morning'
    : hours > 12 && hours < 17
    ? 'afternoon'
    : 'evening'
}

export default getDayNight
