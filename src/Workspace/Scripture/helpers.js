import usfmjs from 'usfm-js';

// Purpose: application wide
// Scope: limited to resource files and parsing
// Notes: pass in manifests don't fetch them

import * as ApplicationHelpers from '../../helpers';

export async function fetchResources({
  context: {
    username,
    languageId,
    reference: {
      bookId,
    },
  },
  manifests,
}) {
  let resources = {
    ult: null,
    ust: null,
    tn: null,
    original: null,
  };
  const { uhb: uhbManifest, ugnt: ugntManifest} = manifests;
  const testament = whichTestament({bookId, uhbManifest, ugntManifest})
  const originalManifest = (testament === 'old') ? uhbManifest : ugntManifest;

  const resourceIds = ['ult', 'ust', 'tn', 'original'];
  const promises = resourceIds.map(async (resourceId) => {
    let manifest;
    if (['ult','ust'].includes(resourceId)) {
      manifest = manifests[resourceId];
      return fetchBook({username, languageId, resourceId, bookId, manifest});
    }
    if (resourceId === 'tn') {
      manifest = manifests[resourceId];
      return translationNotes({username, languageId, bookId, manifest});
    }
    if (resourceId === 'original') {
      return fetchOriginalBook({username, languageId, bookId, uhbManifest, ugntManifest});
    }
  });
  const resourcesArray = await Promise.all(promises);
  resourceIds.forEach((resourceId, index) => {
    const data = resourcesArray[index];
    const manifest = (resourceId === 'original') ? originalManifest : manifests[resourceId];
    resources[resourceId] = {
      manifest,
      data
    };
  });
  return resources;
};

export async function fetchBook({username, languageId, resourceId, bookId, manifest}) {
  const {projects} = manifest;
  if (!projectByBookId({projects, bookId}))
    throw(Error(`book not found in ${resourceId}`));
  const repository = ApplicationHelpers.resourceRepositories({languageId})[resourceId];
  const usfm = await fetchFileByBookId({username, repository, bookId, manifest});
  const json = usfmjs.toJSON(usfm);
  return json.chapters;
};

export const whichTestament = ({bookId, uhbManifest, ugntManifest}) => {
  let testament;
  const uhbProject = projectByBookId({projects: uhbManifest.projects, bookId});
  const ugntProject = projectByBookId({projects: ugntManifest.projects, bookId});
  if (uhbProject) testament = 'old';
  if (ugntProject) testament = 'new';
  return testament;
}

export async function fetchOriginalBook({username, languageId, bookId, uhbManifest, ugntManifest}) {
  let manifest, repository;
  const testament = whichTestament({bookId, uhbManifest, ugntManifest});
  const repositories = ApplicationHelpers.resourceRepositories({languageId});
  if (testament === 'old') {
    manifest = uhbManifest;
    repository = repositories.uhb;
  };
  if (testament === 'new') {
    manifest = ugntManifest;
    repository = repositories.ugnt;
  };
  const usfm = await fetchFileByBookId({username, repository, bookId, manifest});
  const json = usfmjs.toJSON(usfm);
  return json.chapters;
};

export async function fetchUGNTBook({username, languageId, bookId, manifest}) {
  const repository = ApplicationHelpers.resourceRepositories({languageId}).ugnt;
  const usfm = await fetchFileByBookId({username, repository, bookId, manifest});
  const json = usfmjs.toJSON(usfm);
  return json;
};

export async function fetchUHBBook({username, languageId, bookId, manifest}) {
  const repository = ApplicationHelpers.resourceRepositories({languageId}).uhb;
  const usfm = await fetchFileByBookId({username, repository, bookId, manifest});
  const json = usfmjs.toJSON(usfm);
  return json;
};

export const pivotTranslationNotes = ({tn}) => {
  let translationNotesObject = {};
  let array = JSON.parse(JSON.stringify(tn));
  array.shift();
  array.forEach(item => {
    let [book, chapter, verse, id, support_reference, original_quote, occurrence, gl_quote, occurrence_note] = item;
    if (book && chapter && verse) {
      if (!translationNotesObject[chapter]) translationNotesObject[chapter] = {};
      if (!translationNotesObject[chapter][verse]) translationNotesObject[chapter][verse] = [];
      occurrence_note = (!!occurrence_note) ? occurrence_note.replace(/<br>/g,'\n') : occurrence_note;
      let object = {
        id,
        support_reference,
        original_quote,
        occurrence,
        gl_quote,
        occurrence_note,
      };
      translationNotesObject[chapter][verse].push(object);
    }
  });
  return translationNotesObject
}

export async function translationNotes({username, languageId, bookId, manifest}) {
  const data = await fetchNotes({username, languageId, bookId, manifest});
  return data;
};

export async function fetchNotes({username, languageId, bookId, manifest}) {
  const repository = ApplicationHelpers.resourceRepositories({languageId}).tn;
  const tsv = await fetchFileByBookId({username, repository, bookId, manifest});
  const data = tsvParse({tsv});
  return data;
};

export async function fetchFileByBookId({username, repository, bookId, manifest}) {
  const {projects} = manifest;
  let {path} = projectByBookId({projects, bookId});
  path = path.replace(/^\.\//, '');
  const data = await ApplicationHelpers.fetchFileFromServer({username, repository, path});
  return data;
};

export const projectByBookId = ({projects, bookId}) => {
  const _projects = projects.filter(item => item.identifier === bookId);
  let project;
  if (_projects.length > 0) {
    project = _projects[0];
  }
  return project;
}

export const tsvParse = ({tsv}) =>
  tsv.split('\n').map(row => row.trim().split('\t'));