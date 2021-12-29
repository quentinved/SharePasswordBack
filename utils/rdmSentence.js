var verbs, nouns, adjectives, adverbs, preposition;
adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];

const sentence = function() {
    var rand1 = Math.floor(Math.random() * 5);
    var rand2 = Math.floor(Math.random() * 5);
    var rand3 = Math.floor(Math.random() * 5);
    var rand4 = Math.floor(Math.random() * 5);
    var rand5 = Math.floor(Math.random() * 5);
    var rand6 = Math.floor(Math.random() * 5);
    var content = adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4]
    // var content = "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + 
    // " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " 
    // + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6];

    return content
};
// sentence();

module.exports = {
    sentence
  }