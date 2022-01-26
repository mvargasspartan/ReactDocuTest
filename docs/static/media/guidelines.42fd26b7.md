# Transcription Guidelines.

Please read this information before you start with the transcriptions.<br/><br/>

## -Transcribe the audio as close as possible to the vocalization from the speaker.

In general, all of these guidelines boil down to this one, **always write what you hear, as your hear it.** Do not add symbols, numbers or anything that is not there or has not intrinsic relationship sound → tokens.

Make sure to pay attention to contractions, for example there is a big difference on the pronunciation of shouldn’t and should not. So these values should not be changed, our models   should be able to model contractions!<br/><br/>

## -Avoid special symbols.

There is a big necessity to avoid symbols in our models. While we might want to know is a speaker is asking a question for example, the relationship token -> sound will probably not be very precise, as questions for example would be better modeled by a classification network.

Avoid symbols as “@”, “.”, “,” instead use the vocalizations that are used (“at”, “dot / “period”, “comma”, etc).

Avoid punctuation except for the apostrophe symbol.
You will also see any lint errors in the console.<br/><br/>

## -Normalize numbers.

Numbers are another very clear case of wasting the phoneme →  token relationship that one would expect in audio transcriptions. As such, **always use text normalized versions of numbers,** that is for the symbol "5" five, write five; for the symbol "2nd" write second, etc.

While we are exploring options to make the Google Cloud Speech to Text API return text only, this is not a given, as such please correct any of these occurrences in the transcriptions made.<br/><br/>

## -Spellings.

Whenever facing spellings, it is not unusual for Google’s model to return the spelled word as a single unit, this is not exactly what we want or need. While this might be worth a revisit in the future, for now we are making sure to separate the word spelled by each letter. So for example if one person is to spell alpha, we would write a l p h a, please do note the spaces between each word.<br/><br/>

## -Composed words.

It is normal in English and other languages to use hyphens (“-” symbol) to concatenate words that would otherwise have an intrinsic meaning by themselves, for example pre-training, however for our purposes we do not intend to set this character, as it can be seen that it does not have a characteristic sound. This means that for our transcriptions we want this character replaced with an space character “ “.<br/><br/>

