import { useMemo } from 'react';
import { examplePath } from '../utils/paths';

/**
  Hook to sort a list of .pde files so the file with the same name
  of the examples is first in the array.
**/
export const useOrderedPdes = (name, nodes) => {
  return useMemo(() => {
    const main = nodes.find((pde) => pde.name === name);
    const rest = nodes.filter((pde) => pde.name !== name);
    rest.unshift(main);
    return rest;
  }, [name, nodes]);
};

/**
  Hook to find the json and image for each related example
  @param {Array} examples Array of example JSON files
  @param {Array} images Array of sharp image objects
**/
export const usePreparedExamples = (examples, images) => {
  return useMemo(() => {
    // Prepare examples by extracting the necessary info and
    const prepared = [];

    for (let i = 0; i < examples.length; i++) {
      const example = examples[i];

      // Find the image
      let image;
      if (Array.isArray(images)) {
        for (let j = 0; j < images.length; j++) {
          if (images[j].name === example.name) {
            image = images[j];
            break;
          }
        }
      }

      const [category, subCategory] = example.relativeDirectory.split('/');
      prepared.push({
        slug: example.name,
        path: examplePath(example.name),
        name: example.childJson.name,
        category,
        subCategory,
        image,
      });
    }

    return prepared;
  }, [examples, images]);
};

/**
  Hook to turn an array of prepared examples into an object that represent
  the tree of categories, subcategories, and items.
  @param {Array} examples Array of examples that have been through usePreparedExamples()
  @param {string} searchTerm String with search term to use for filtering
**/
export const useOrganizedExamples = (examples) => {
  return useMemo(() => {
    const tree = {};

    for (let i = 0; i < examples.length; i++) {
      const example = examples[i];

      if (!tree[example.category]) {
        tree[example.category] = {};
      }

      if (!tree[example.category][example.subCategory]) {
        tree[example.category][example.subCategory] = [];
      }

      tree[example.category][example.subCategory].push(example);
    }

    return tree;
  }, [examples]);
};

/**
  Simple hook to sort an array of examples based on an array of string names
  @param {Array} examples Array of examples that have been through usePreparedExamples()
  @param {Array} related Array of string names
**/
export const useRelatedExamples = (examples, related) => {
  return useMemo(() => {
    const filtered = [];
    for (let i = 0; i < examples.length; i++) {
      if (related.includes(examples[i].slug)) {
        filtered.push(examples[i]);
      }
    }
    return filtered;
  }, [examples, related]);
};
