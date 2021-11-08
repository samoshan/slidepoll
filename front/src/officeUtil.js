/* eslint-disable no-undef */

export function getSelectedSlideIndex() {
  return new OfficeExtension.Promise(function(resolve, reject) {
    Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function(asyncResult) {
      try {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
          reject(console.error(asyncResult.error.message));
        } else {
          console.log(asyncResult.value.slides[0]);
          resolve(asyncResult.value.slides[0].index);
        }
      } 
      catch (error) {
        reject(console.log(error));
      }
    });
  });
}

export async function addTagToSelectedSlide(key, value) {
  await PowerPoint.run(async function(context) {
    let selectedSlideIndex = await getSelectedSlideIndex();
    selectedSlideIndex = selectedSlideIndex - 1;
    const slide = context.presentation.slides.getItemAt(selectedSlideIndex);
    slide.tags.add(key, value);

    try {
      await context.sync();
    } catch (error) {
      console.log('Error whilst trying to set slide tag', error);
    }
  });
}

export async function deleteTagFromSelectedSlide(key) {
  await PowerPoint.run(async function(context) {
    let selectedSlideIndex = await getSelectedSlideIndex();
    selectedSlideIndex = selectedSlideIndex - 1;
    const slide = context.presentation.slides.getItemAt(selectedSlideIndex);
    slide.tags.delete(key);

    try {
      await context.sync();
    } catch (error) {
      console.log('Error whilst trying to delete slide tag', error);
    }
  });
}

export async function getSelectedSlideTags() {
  let tags = {};
  await PowerPoint.run(async function(context) {
    let selectedSlideIndex = await getSelectedSlideIndex();
    selectedSlideIndex = selectedSlideIndex - 1;
    const slide = context.presentation.slides.getItemAt(selectedSlideIndex);
    
    slide.load("tags/key, tags/value");
    await context.sync();
    
    for (const tag of slide.tags.items) {
      tags[tag.key] = tag.value;
    }
  });
  return tags;
}
