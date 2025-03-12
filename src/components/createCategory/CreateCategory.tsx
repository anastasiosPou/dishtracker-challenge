'use client';

/*
  The CreateCategory Component is responsible 
  for rendering the form for creating a new category.
*/

//Imports
import Link from "next/link";
import { useCameraGroup } from "../../customHooks/useCameraGroup";
import { gatewayApi } from "../../store";
import { useState } from "react";
import { useRouter } from "next/navigation";

//Constants
const {useCreateCategoryMutation} = gatewayApi;

//Interfaces

/*
 The CreateCategoryFormFields and CreateCategoryFormElements are used to
 provide types to the submit handler.
*/
interface CreateCategoryFormFields extends HTMLFormControlsCollection {
  categoryName: HTMLInputElement;
  categoryLabel: HTMLInputElement;
}

interface CreateCategoryFormElements extends HTMLFormElement {
  readonly elements: CreateCategoryFormFields;
}

export default function CreateCategory() {
  const [inputErrors, setInputErrors] = useState({});
  const cameraGroup = useCameraGroup();
  const router = useRouter();
  const [createCategory, {isLoading}] = useCreateCategoryMutation();

  const validateInput = (userInput: string, categoryProperty: string) => {
    const categoryLabelRegExp = /^([a-zäöü0-9_&ß]+)(\\.[a-zäöü0-9_&ß]+)*$/;
    const categoryNameRegExp = /^[a-zA-Z0-9]+$/;
    return categoryProperty == 'name' ? categoryNameRegExp.test(userInput) : categoryLabelRegExp.test(userInput);
  }

  const handleSubmit = async (e: React.FormEvent<CreateCategoryFormElements>) => {
    e.preventDefault();

    //TODO This is problematic. I should ind a better way to remove the errors from the previous user entry.
    setInputErrors({});

    const {elements} = e.currentTarget;
    const categoryName = elements.categoryName.value.trim();
    const categoryLabel = elements.categoryLabel.value.trim().toLowerCase();
    let errors = {};

    const isCategoryNameValid = validateInput(categoryName, 'name');
    if (!isCategoryNameValid) errors['CategoryNameError'] = "*Category name isn't valid.(No spaces or funny characters allowed";

    const isCategoryLabelValid = validateInput(categoryLabel, 'label');
    if (!isCategoryLabelValid) errors['CategoryLabelError'] = "*Category label isn't valid.";

    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      return;
    }

    try {
      const newCategory = {
        label: categoryLabel,
        parent_category_label: null,
        name: categoryName,
      }
      await createCategory(newCategory).unwrap();
      alert('Category created!')
      router.push(`/dashboard/allProducts?cameraGroup=${cameraGroup}`);
    }
    catch (err) {
      alert('An error occured while trying to create a category: ' + err);
    }

  }

  return (
    <section className="create-category">
      <h2>Create a Category</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="categoryName">Name</label>
        <span className="input-error-message">{inputErrors['CategoryNameError']}</span>
        <input type="text" id="categoryName" required />
        <label htmlFor="categoryLabel">Label</label>
        <span className="input-error-message">{inputErrors['CategoryLabelError']}</span>
        <input type="text" id="categoryLabel" required />
        <button type="submit" disabled={isLoading}>Create Category</button>
        <Link href={`/dashboard/allProducts?cameraGroup=${cameraGroup}`}>Cancel</Link>
      </form>
    </section>
  );
}