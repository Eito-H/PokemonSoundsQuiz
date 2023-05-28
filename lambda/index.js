/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const Util = require('util.js');
const Pokemons = require('pokemons.js');
const Generation = require('generation.js');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const nos = Generation.get_no(1);

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        let attr = await handlerInput.attributesManager.getPersistentAttributes();
        if(!attr.q_num || !attr.correct){
            attr.q_num = 1;
            attr.correct = String(Math.floor(Math.random() * (nos.max_no + 1 - nos.min_no)) + nos.min_no).padStart(3, '0');
        }
        let speakOutput = `ようこそポケモン鳴き声クイズへ。第${attr.q_num}問。`;

        // ポケモンの鳴き声をランダムで再生
        speakOutput += getSounds(attr.correct);

        // 問題数と正解を保存
        handlerInput.attributesManager.setPersistentAttributes(attr);
        await handlerInput.attributesManager.savePersistentAttributes();
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PokemonIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PokemonIntent';
    },
    async handle(handlerInput) {
        // pokemon スロットの値を取得
        const pokemon_name = handlerInput.requestEnvelope.request.intent.slots.pokemon.value;
        let pokemon_no = '000';
        if(handlerInput.requestEnvelope.request.intent.slots.pokemon.resolutions.resolutionsPerAuthority[0].status.code !== 'ER_SUCCESS_NO_MATCH'){
            pokemon_no = handlerInput.requestEnvelope.request.intent.slots.pokemon.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        
        // sessionを取得
        let attr = await handlerInput.attributesManager.getPersistentAttributes();
        
        if(pokemon_name === 'もう一回'){ //もう一度再生
            let speakOutput = `第${attr.q_num}問。`;
            speakOutput += getSounds(attr.correct);

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }else if(pokemon_no === '000' && pokemon_name !== 'パス'){ //聞き取りできないためもう一度再生
            let speakOutput = `よく聞き取れませんでした。`;

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }else{ //解答がある場合
            let speakOutput = '';
            if(pokemon_no === attr.correct){
                speakOutput += '正解です。';
                attr.correct_num = attr.correct_num ? attr.correct_num + 1 : 1;
            }else {
                if(pokemon_name !== 'パス') speakOutput += '不正解です。'; 
                speakOutput += `正解は${Pokemons.get_name(attr.correct)}です。`;
                if(!attr.correct_num) attr.correct_num = 0;
            }

            // 問題数をセット        
            attr.q_num = Number(attr.q_num) + 1;

            // 10問終えたら終了
            if(attr.q_num > 10){
                handlerInput.attributesManager.deletePersistentAttributes();
                
                speakOutput += `十問ちゅう${attr.correct_num}問正解しました。`;
                if(attr.correct_num === 10) speakOutput += '全問正解凄い！';
                else if(attr.correct_num > 7) speakOutput += 'なかなかやりますね！';
                else if(attr.correct_num > 5) speakOutput += 'あと一歩ですね！';
                else if(attr.correct_num > 3) speakOutput += 'まだまだ行けそうですね！'
                else speakOutput += 'どんまいです。';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }else{
                // 次の鳴き声
                let speakOutput2 = `第${attr.q_num}問。`;
                const next_no = String(Math.floor(Math.random() * (nos.max_no + 1 - nos.min_no)) + nos.min_no).padStart(3, '0');
                speakOutput2 += getSounds(next_no);
        
                // 問題数と正解を保存        
                attr.correct = next_no;
                handlerInput.attributesManager.setPersistentAttributes(attr);
                await handlerInput.attributesManager.savePersistentAttributes();
    
                return handlerInput.responseBuilder
                    .speak(speakOutput + speakOutput2)
                    .reprompt(speakOutput2)
                    .getResponse();
            }
        }
    }
};
const getSounds = (sound_id) => {
    return `<audio src="${Util.getS3PreSignedUrl("Media/cry/pv" + sound_id + ".mp3").replace(/&/g,'&amp;')}"/>`;
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        PokemonIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('PokemonSoundsQuiz/v1.2')
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter(
            {bucketName:process.env.S3_PERSISTENCE_BUCKET}))
    .lambda();