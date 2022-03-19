/**
 * 
 * @param {string} text 
 * @param {string} color 
 */
async function BarrasVerdes(text){
    let palo = 53;
    console.log(`╔═════════════════════════════════════════════════════╗`.green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`║ `.green + `      ${text}`.green + " ".repeat(-1 + palo - 1 - `      ${text}`.length) + " ║".green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`╚═════════════════════════════════════════════════════╝`.green)
}

async function BarrasRojas(text){
    let palo = 53;
    console.log(`╔═════════════════════════════════════════════════════╗`.red)
    console.log(`║ `.red + " ".repeat(-1 + palo - 1) + " ║".red)
    console.log(`║ `.red + `      ${text}`.red + " ".repeat(-1 + palo - 1 - `      ${text}`.length) + " ║".red)
    console.log(`║ `.red + " ".repeat(-1 + palo - 1) + " ║".red)
    console.log(`╚═════════════════════════════════════════════════════╝`.red)
}

module.exports = {
    BarrasVerdes,
    BarrasRojas
}