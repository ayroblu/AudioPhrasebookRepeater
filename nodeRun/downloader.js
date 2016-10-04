var request = require('request');
var async = require('async');
var http = require('http');
var fs = require('fs');

var id = 0;
var filename = 'unknown.3mp3';
var filepath = '/static/unknown.3mp3';

function getmp3(dir, text, lang, idx, next){
  async.series([function(cb){
    request.post({
      url:'http://soundoftext.com/sounds'
    , form:{text:text,lang:lang}
    }, function(err,httpResponse,body){
      if (err){
        console.error(err);
        return;
      }
      var res = JSON.parse(body);
      if (!res.success){
        console.error("no success?!", res);
        return;
      }
      id = res.id;
      cb();
    });
  }, function(cb){
    request('http://soundoftext.com/sounds/'+id, function(err, response, body){
      if (err){
        console.error(err);
        return;
      }
      var regex = /audio[\s\S]*?src="(.*?)" [\s\S]*?audio/g;
      var match = regex.exec(body);
      if (!match){
        console.log(body);
        return;
      }
      filepath = match[1];
      filename = filepath.replace(/^.*[\\\/]/, '');
      cb();
    });
  }, function(cb){
    var mkdirp = require('mkdirp');
    console.log('writing: ', 'audioFiles/'+dir+"/"+idx+"_"+lang+"_"+filename);
    mkdirp('audioFiles/'+dir, function(err) { 
      var file = fs.createWriteStream('audioFiles/'+dir+"/"+idx+"_"+lang+"_"+filename);
      var request = http.get("http://soundoftext.com" + filepath, function(response) {
        response.pipe(file);
        next();
      });
    });
  }]);
}

var words = {
  common_signs:[{
    en: "open"
  , fr: "ouvert"
  }, {
    en: "closed (shop)"
  , fr: "Fermé"
  }, {
    en: "closed (road)"
  , fr: "Barrée"
  }, {
    en: "entrance"
  , fr: "Entrée"
  }, {
    en: "exit"
  , fr: "Sortie"
  }, {
    en: "push"
  , fr: "Poussez"
  }, {
    en: "pull"
  , fr: "Tirez"
  }, {
    en: "toilet"
  , fr: "Toilette"
  }, {
    en: "men"
  , fr: "Hommes"
  }, {
    en: "women"
  , fr: "Femmes"
  }, {
    en: "forbidden"
  , fr: "Interdit, Défendu"
  }]
, basics: [{
    en: "Hello. (formal)"
  , fr: "Bonjour"
  }, {
    en: "Hello (informal)"
  , fr: "Salut"
  }, {
    en: "How are you? (formal)"
  , fr: "Comment allez-vous ?"
  }, {
    en: "How are you? (informal)"
  , fr: "Comment vas-tu?"
  }, {
    en: "How are you? (informal)"
  , fr: "Comment ça va ?"
  }, {
    en: "Fine, thank you. "
  , fr: "Bien, merci"
  }, {
    en: "What is your name?"
  , fr: "Comment vous appellez vous ?"
  }, {
    en: "What is your name? (informal) "
  , fr: "Comment t'appelles-tu?"
  }, {
    en: "My name is"
  , fr: "Je m'appelle"
  }, {
    en: "Nice to meet you. (masculine)"
  , fr: "Enchanté"
  }, {
    en: "Nice to meet you. (feminine)"
  , fr: "Enchantée"
  }, {
    en: "Please (formal)"
  , fr: "S'il vous plaît"
  }, {
    en: "Please (formal)"
  , fr: "Je vous prie"
  }, {
    en: "Please (informal)"
  , fr: "S'il te plaît"
  }, {
    en: "Thank you. "
  , fr: "Merci"
  }, {
    en: "You're welcome"
  , fr: "De rien"
  }, {
    en: "Yes"
  , fr: "Oui"
  }, {
    en: "No"
  , fr: "Non"
  }, {
    en: "Excuse me"
  , fr: "Pardon"
  }, {
    en: "Excuse me"
  , fr: "Excusez-moi"
  }, {
    en: "(I am) Sorry"
  , fr: "(Je suis) Désolé"
  }, {
    en: "What's the time? "
  , fr: "Quelle heure est-il ?"
  }, {
    en: "Goodbye "
  , fr: "Au revoir"
  }, {
    en: "Goodbye (informal) "
  , fr: "Salut"
  }, {
    en: "I can't speak French [well]. "
  , fr: "Je ne parle pas [bien] français"
  }, {
    en: "Do you speak English? "
  , fr: "Parlez-vous anglais ?"
  }, {
    en: "Is there someone here who speaks English? "
  , fr: "Est-ce qu'il y a quelqu'un ici qui parle anglais ?"
  }, {
    en: "Is there someone here who speaks English? "
  , fr: "Y a-t-il quelqu'un ici qui parle anglais ?"
  }, {
    en: "Help! "
  , fr: "Au secours!"
  }, {
    en: "Look out! "
  , fr: "Attention !"
  }, {
    en: "Have a nice day"
  , fr: "Bonne journee"
  }, {
    en: "Good Day, Good morning "
  , fr: "Bonjour"
  }, {
    en: "Good evening. "
  , fr: "Bonsoir"
  }, {
    en: "Good night. "
  , fr: "Bonne nuit"
  }, {
    en: "Sweet dreams "
  , fr: "Fais de beaux reves"
  }, {
    en: "I don't understand"
  , fr: "Je ne comprends pas"
  }, {
    en: "Where is the toilet? "
  , fr: "Où sont les toilettes ?"
  }, {
    en: "How do you say"
  , fr: "Comment dit-on"
  }, {
    en: "What is this called? "
  , fr: "Comment appelle-t-on ceci ?"
  }, {
    en: "What is that called? "
  , fr: "Comment appelle-t-on ça ?"
  }]
, numbers: [{
    en: "1 "
  , fr: "un"
  }, {
    en: "1 "
  , fr: "une"
  }, {
    en: "2 "
  , fr: "deux"
  }, {
    en: "3 "
  , fr: "trois"
  }, {
    en: "4 "
  , fr: "quatre"
  }, {
    en: "5 "
  , fr: "cinq"
  }, {
    en: "6 "
  , fr: "six"
  }, {
    en: "7 "
  , fr: "sept"
  }, {
    en: "8 "
  , fr: "huit"
  }, {
    en: "9 "
  , fr: "neuf"
  }, {
    en: "10 "
  , fr: "dix"
  }, {
    en: "11 "
  , fr: "onze"
  }, {
    en: "12 "
  , fr: "douze"
  }, {
    en: "13 "
  , fr: "treize"
  }, {
    en: "14 "
  , fr: "quatorze"
  }, {
    en: "15 "
  , fr: "quinze"
  }, {
    en: "16 "
  , fr: "seize"
  }, {
    en: "17 "
  , fr: "dix-sept"
  }, {
    en: "18 "
  , fr: "dix-huit"
  }, {
    en: "19 "
  , fr: "dix-neuf"
  }, {
    en: "20 "
  , fr: "vingt"
  }, {
    en: "21 "
  , fr: "vingt-et-un"
  }, {
    en: "22 "
  , fr: "vingt-deux"
  }, {
    en: "23 "
  , fr: "vingt-trois"
  }, {
    en: "30 "
  , fr: "trente"
  }, {
    en: "40 "
  , fr: "quarante"
  }, {
    en: "50 "
  , fr: "cinquante"
  }, {
    en: "60 "
  , fr: "soixante"
  }, {
    en: "70 "
  , fr: "soixante-dix"
  }, {
    en: "70 (belgium Switzerland)"
  , fr: "septante"
  }, {
    en: "80 (belgium)"
  , fr: "quatre-vingt"
  }, {
    en: "80 (switzerland not geneva)"
  , fr: "huitante"
  }, {
    en: "80 (switzerland"
  , fr: "octante"
  }, {
    en: "90 "
  , fr: "quatre-vingt-dix"
  }, {
    en: "90 (belgium and switzerland)"
  , fr: "nonante"
  }, {
    en: "100 "
  , fr: "cent"
  }, {
    en: "200 "
  , fr: "deux cent"
  }, {
    en: "300 "
  , fr: "trois cent"
  }, {
    en: "1000 "
  , fr: "mille"
  }, {
    en: "2000 "
  , fr: "deux mille"
  }, {
    en: "1,000,000 "
  , fr: "un million"
  }, {
    en: "one million euros"
  , fr: "un million d'euros."
  }, {
    en: "number"
  , fr: "numéro"
  }, {
    en: "half "
  , fr: "demi"
  }, {
    en: "half "
  , fr: "moitié"
  }, {
    en: "less "
  , fr: "moins"
  }, {
    en: "more "
  , fr: "plus"
  }]
, time: [{
    en: "now "
  , fr: "maintenant"
  }, {
    en: "later "
  , fr: "plus tard"
  }, {
    en: "before "
  , fr: "avant"
  }, {
    en: "after "
  , fr: "après"
  }, {
    en: "morning "
  , fr: "le matin"
  }, {
    en: "in the morning "
  , fr: "au matin"
  }, {
    en: "in the morning "
  , fr: "dans la matinée"
  }, {
    en: "afternoon "
  , fr: "l'après-midi"
  }, {
    en: "in the afternoon "
  , fr: "dans l'après-midi"
  }, {
    en: "evening "
  , fr: "le soir"
  }, {
    en: "in the evening"
  , fr: "dans la soirée"
  }, {
    en: "in the evening"
  , fr: "au soir"
  }, {
    en: "night "
  , fr: "la nuit"
  }, {
    en: "in the night "
  , fr: "à la nuit"
  }]
, clock_time: [{
    en: "hour "
  , fr: "heure"
  }, {
    en: "minute "
  , fr: "minute"
  }, {
    en: "quarter "
  , fr: "quart"
  }, {
    en: "quarter "
  , fr: "le quart"
  }, {
    en: "quarter past seven"
  , fr: "sept heures et quart"
  }, {
    en: "quarter to five"
  , fr: "cinq heures moins le quart"
  }, {
    en: "half-past ten"
  , fr: "dix heures et demie"
  }, {
    en: "one am"
  , fr: "une heure du matin"
  }, {
    en: "two am"
  , fr: "deux heures du matin"
  }, {
    en: "noon"
  , fr: "midi"
  }, {
    en: "one pm"
  , fr: "treize heures"
  }, {
    en: "one pm"
  , fr: "une heure de l'après-midi"
  }, {
    en: "two pm"
  , fr: "quatorze heures"
  }, {
    en: "two pm"
  , fr: "deux heures de l'après-midi"
  }, {
    en: "six pm"
  , fr: "dix-huit heures"
  }, {
    en: "six pm"
  , fr: "six heures du soir"
  }, {
    en: "half past seven"
  , fr: "sept heures et demi"
  }, {
    en: "half past seven"
  , fr: "dix-neuf heures trente"
  }, {
    en: "midnight"
  , fr: "minuit"
  }]
, duration: [{
    en: "minutes"
  , fr: "minutes"
  }, {
    en: "hours"
  , fr: "heures"
  }, {
    en: "days"
  , fr: "jours"
  }, {
    en: "weeks"
  , fr: "semaines"
  }, {
    en: "months"
  , fr: "mois"
  }, {
    en: "years"
  , fr: "ans"
  }, {
    en: "years"
  , fr: "années"
  }, {
    en: "daily "
  , fr: "quotidien"
  }, {
    en: "weekly "
  , fr: "hebdomadaire"
  }, {
    en: "monthly "
  , fr: "mensuel"
  }, {
    en: "yearly "
  , fr: "annuel"
  }]
, days: [{
    en: "today "
  , fr: "aujourd'hui"
  }, {
    en: "yesterday "
  , fr: "hier"
  }, {
    en: "tomorrow "
  , fr: "demain"
  }, {
    en: "this week "
  , fr: "cette semaine"
  }, {
    en: "last week "
  , fr: "la semaine dernière"
  }, {
    en: "next week "
  , fr: "la semaine prochaine"
  }, {
    en: "Monday "
  , fr: "lundi"
  }, {
    en: "Tuesday "
  , fr: "mardi"
  }, {
    en: "Wednesday "
  , fr: "mercredi"
  }, {
    en: "Thursday "
  , fr: "jeudi"
  }, {
    en: "Friday "
  , fr: "vendredi"
  }, {
    en: "Saturday "
  , fr: "samedi"
  }, {
    en: "Sunday "
  , fr: "dimanche"
  }]
, colors: [{
    en: "black "
  , fr: "noir"
  }, {
    en: "black "
  , fr: "noire"
  }, {
    en: "white "
  , fr: "blanc"
  }, {
    en: "white "
  , fr: "blanche"
  }, {
    en: "gray "
  , fr: "gris"
  }, {
    en: "gray "
  , fr: "grise"
  }, {
    en: "red "
  , fr: "rouge"
  }, {
    en: "blue "
  , fr: "bleu"
  }, {
    en: "blue "
  , fr: "bleue"
  }, {
    en: "yellow "
  , fr: "jaune"
  }, {
    en: "green "
  , fr: "vert"
  }, {
    en: "green "
  , fr: "verte"
  }, {
    en: "orange "
  , fr: "orange"
  }, {
    en: "purple "
  , fr: "violette"
  }, {
    en: "purple "
  , fr: "violet"
  }, {
    en: "brown "
  , fr: "brune"
  }, {
    en: "brown "
  , fr: "brun"
  }, {
    en: "brown "
  , fr: "marron"
  }, {
    en: "pink "
  , fr: "rose"
  }]
};

var funcs = [];
//for (var name in words){
//  if (words.hasOwnProperty(name)){
//    for (var i = 0; i < words[name].length; ++i){
//      for (var lang in words[name][i]){
//        if (words[name][i].hasOwnProperty(lang)){
//          funcs.push(function(word, group, lang, idx){return function(cb){
//            getmp3(group, word, lang, idx, cb);
//          }}(words[name][i][lang], name, lang, i));
//        }
//      }
//    }
//  }
//}
for (var lang in words['basics'][words['basics'].length-3]){
  if (words['basics'][words['basics'].length-3].hasOwnProperty(lang)){
    funcs.push(function(word, group, lang, idx){return function(cb){
      getmp3(group, word, lang, idx, cb);
    }}(words['basics'][words['basics'].length-3][lang], 'basics', lang, words['basics'].length-3));
  }
}
async.series(funcs);

