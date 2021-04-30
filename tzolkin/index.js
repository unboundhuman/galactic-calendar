class Tzolkin {
  constructor(date) {
    if(date instanceof Date) {
      this._date = date
    }else if(typeof date === 'string') {
      this._date = new Date(date)
    }else{
      throw new Error('Date must be an instance of the Date object or a date string.')
    }
    this._init()
    this._yearCalendar = this._prepCalendar()
  }
  
  _init = () => {
    this._tzolkinData = require('../data/tzolkin.json')
    this._calendarData = require('../data/calendar.json')
    this._tzolkin = this._prepTzolkin()
  }

  lookupKin = (kin) => {
    this._init()
    this._kin = kin

    if(isNaN(this._kin)) {
      throw new Error('Input must be a number between 1 and 260.')
    }else if(this._kin < 0 || this._kin > 260) {
      throw new Error('Input must be a number between 1 and 260.')
    }
    
    return this._tzolkin[this._kin - 1]
  }

  get kin() {
    return this._tzolkin[this._convertTzolkin() - 1]
  }

  showKin = () => {
    if(`${this._date.getMonth() + 1}-${this._date.getDate()}` === '2-29') {
      // If February 29th
      console.log(`\nKin for ${this._date}\nToday is ${this._tzolkinData.leapDay.kinName}\n${this._tzolkinData.leapDay.kinAffirm}`)
    }else{
      let kinCount = this._convertTzolkin()  
      console.log(`\nKin ${kinCount}: ${this._tzolkin[kinCount - 1].kinName}\n${this._tzolkin[kinCount - 1].kinAffirm}`)
    }
  }

  showDate = () => {
    let today = {} 
    let year = this._yearCalendar[0].tzolkin.kinName

    if(`${this._date.getMonth() + 1}-${this._date.getDate()}` === '2-29') {
      // If February 29th
      console.log(`\nGalactic Calendar Date for ${this._date.toDateString()}\n\n${this._tzolkinData.leapDay.kinName}\n${year} Year`)
    }else{
      // Find today
      for(var k = 0; k < this._yearCalendar.length; k++) {
        if(this._yearCalendar[k].gregorianDay.toDateString() === this._date.toDateString()) {
          today = this._yearCalendar[k]
          break
        }
      }

      console.log(`\nGalactic Calendar Date for ${this._date.toDateString()}\n\n${today.weekDay.name}, ${today.moon} ${today.galacticDay}\n${year} Year`)
    }
  }

  showFullDate = () => {
    this.showDate()
    this.showKin()
  }

  _prepTzolkin = () => {
    let tzolkin = []

    for(var x = 0; x < 260; x++) {

      let toneNumber = x < 13 ? x + 1 : (x + 1) % 13
      toneNumber = toneNumber == 0 ? 13 : toneNumber

      let sealNumber = x < 20 ? x + 1: (x + 1) % 20
      sealNumber = sealNumber == 0 ? 20 : sealNumber

      let tone = this._tzolkinData.tones[(toneNumber).toString()]
      let seal = this._tzolkinData.seals[(sealNumber).toString()]

      let name = seal.color + " " + tone.name + " " + seal.name
      let affirmation = `I ${tone.power} in order to ${seal.action},\n${tone.action} ${seal.essence}.\nI seal the ${seal.stage} of ${seal.power}\nWith the ${tone.name} tone of ${tone.essence}.`
      let affirmGuide = () => {
          let guide1 = [1,6,11]
          let guide2 = [2,7,12]
          let guide3 = [3,8,13]
          let guide4 = [4,9]

          if (guide1.some((t)=> toneNumber == t)) {
            return "\nI am guided by my own power doubled."
          } else {
            let guideKey = ""
            if (guide2.some((t)=> toneNumber == t)) {
              guideKey = "2-7-12"
            } else if (guide3.some((t)=> toneNumber == t)) {
              guideKey = "3-8-13"
            } else if (guide4.some((t)=> toneNumber == t)) {
              guideKey = "4-9"
            } else {
              guideKey = "5-10"
            }
            return "\nI am guided by the power of " + this._tzolkinData.seals[seal.guides[guideKey]].power + "."
          }
      }

      let affirmPortal = () => {
        let portalLine = this._tzolkinData.portals.some((day) => x + 1 == day) ? "\nI am a galactic portal; enter me." : ""
        return portalLine
      }

      affirmation += " " + affirmGuide() + affirmPortal()

      tzolkin.push({
        kinName : name,
        kinNumber : x + 1,
        kinAffirm : affirmation
      })
    }
    return tzolkin
  }
  
  _convertTzolkin = (date = undefined) => {
    
    let tDate = date === undefined ? this._date : date
    let parsedMonth = tDate.getMonth() + 1
    let parsedDay = tDate.getDate()
    let parsedYear = tDate.getFullYear()
    
    let countYear = 0
    let countMonth = this._tzolkinData.gregorian[parsedMonth - 1]
    let countDay = parsedDay
  
    if(parsedMonth == 2 && parsedDay == 29) {
      countMonth = this._tzolkinData.gregorian[2]
      countDay = 1
    }
  
    if(parsedYear >= 1026) {
      countYear = parsedYear == 1026 ? 62 : ((parsedYear - 1026) * 365) + 62
    }else{
      throw new Error('Year must be 1026 CE or later.')
    }
  
    let kinCount = countYear + countMonth + countDay
    kinCount = kinCount < 261 ? kinCount : kinCount % 260
    kinCount = kinCount == 0 ? 260 : kinCount
    
    return kinCount
  }
  
  _prepCalendar = (date = undefined) => {
    let cDate = date === undefined ? this._date : date
    let moonDays = 28
    let galacticNewYear = new Date(this._getGNY(cDate))
    let currentDate = galacticNewYear
    let yearCalendar = []
    let moonCount = 0

    for(const moon in this._calendarData.moons) {
      let moonName = `${this._calendarData.moons[moon].name} ${this._calendarData.moons[moon].totem} Moon`
      let isLeapYear = this._isLeapYear(currentDate.getFullYear())
      moonCount += 1

      // Add to number of days in the 'leap Moon' to account for day out of time
      if(isLeapYear && moonCount === 8) moonDays += 1;
      // Reset number of days in a Moon after 'leap month'
      if(isLeapYear && moonCount === 9) moonDays = 28; 

      for(var d = 0; d < moonDays; d++) {

        if(this._isLeapYear(currentDate.getFullYear()) && moonCount === 8 && d === 22) {
          // Add the 'leap day' Day out of Time
          yearCalendar.push({
            moon: this._tzolkinData.leapDay.kinName,
            galacticDay : '0.0',
            gregorianDay : currentDate,
            weekDay : { 'name': "Hunab'Ku"},
            tzolkin : this._tzolkinData.leapDay
          })
          
        }else{
          // This is the standard sequence
          let tzolkinCount = this._convertTzolkin(currentDate)
          let currentTzolkin = this._tzolkin[tzolkinCount - 1]
    
          yearCalendar.push({
            moon: moonName,
            galacticDay : d + 1,
            gregorianDay : currentDate,
            weekDay : this._calendarData.days[ d < 7 ? d : d % 7],
            tzolkin : currentTzolkin
          })
        }
        currentDate = this._addDays(currentDate, 1)
      }
    }
  
    let dootDate = new Date(`25 July ${galacticNewYear.getFullYear() + 1}`)
    let dootCount = this._convertTzolkin(dootDate)
    let dootTzolkin = this._tzolkin[dootCount]
    yearCalendar.push({
      moon: 'Day Out of Time',
      galacticDay : 0,
      gregorianDay : dootDate,
      weekDay : { 'name' : 'none' },
      tzolkin : dootTzolkin
    })
  
    return yearCalendar
  }

  _getGNY = (date) =>{
    let gDate = date === undefined ? this._date : date
    let gny = ''
    if(gDate.getMonth() < 6 || (gDate.getMonth() === 6 && gDate.getDate() < 26)) {
      gny = `26 July ${gDate.getFullYear() - 1}`
    }else{
      gny = `26 July ${gDate.getFullYear()}`
    }
    return gny
  }
  
  _addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  _isLeapYear = (year) => {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
  }
}

module.exports = Tzolkin


