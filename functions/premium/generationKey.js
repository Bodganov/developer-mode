module.exports = {
    premium_key
}

function premium_key(){
    let generation = 'ABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789';
    let part1 = '';
    let part2 = '';
    let part3 = '';
    let part4 = '';

    for(let i = 0; i < 4; i++){
        part1 += generation.charAt(Math.floor(Math.random() * generation.length));
        part2 += generation.charAt(Math.floor(Math.random() * generation.length));
        part3 += generation.charAt(Math.floor(Math.random() * generation.length));
        part4 += generation.charAt(Math.floor(Math.random() * generation.length));
    }

    return `${part1}-${part2}-${part3}-${part4}`
}