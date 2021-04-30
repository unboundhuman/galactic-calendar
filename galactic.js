const Tzolkin = require('./tzolkin/index.js')

/**
 * Example usage
 * =============
 * Note: Some things might be broken
 * Only works with years from 1026 CE onward.
 */


const today = new Tzolkin(new Date('2021-05-01'))       // Instantiate with current date
const dalaiLama = new Tzolkin('1935-07-06') // Instantiate with a specific date

// today.kin                                // Returns object with the kin of the instantiated day
console.log(today.kin)
// today.lookupKin(63)                      // Returns object with a specific kin by number
console.log(today.lookupKin(63))

console.log(`\n\n# Dalai Lama's Birthday`)
dalaiLama.showDate()                        // Display the set Galactic Calendar Day in the console
dalaiLama.showKin()                         // Display the Kin for the set day in the console

console.log(`\n\n# Today`)
today.showFullDate()                        // Display the Galactic Day and Kin in the console,
                                            // equivalent to .showDate() and .showKin() separately

