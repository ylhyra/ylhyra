# Audio synchronization

**NOTE: The audio synchronization functionality is temporarily turned off**, as it needs some refactoring.

We currently only support uploading a single audio file. In the future, more files (different speakers, different speed) ought to be supported.

We use [Aeneas](https://github.com/readbeyond/aeneas/) to synchronize audio and text.

## Input to Aeneas

In the function {@link prepareXmlForAeneas} we:

1. Find sections of text that are content. They are marked as such with the HTML attribute `data-item-that-may-have-audio` and excluded with `data-no-audio`.
2. Return a stripped down version of the document containint only sentences and words and their IDs.

Synchronization can take several minutes.

### Output

The output from Aeneas is on the format {@link AeneasAudioSyncOutput}.

To prevent highlighting very short short words (results in distracting bursts of highlighting), words under 0.3 seconds are merged into their sibling (in {@link MergeShortWords}).

We flatten that list into the {@link LongAudioSyncData} format (done in the folder `postprocessing`) for two reasons:

- The list can be easily accessed without having to loop through it to check if more elements are shown.
- We now know exactly how long until the next event has to be fired.
