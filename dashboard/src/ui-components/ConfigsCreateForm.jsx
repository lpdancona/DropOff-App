/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { API } from "aws-amplify";
import { createConfigs } from "../graphql/mutations";
export default function ConfigsCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    defaultVanPhoto: "",
    defaultUserPhoto: "",
    phoneNumberManager: "",
  };
  const [defaultVanPhoto, setDefaultVanPhoto] = React.useState(
    initialValues.defaultVanPhoto
  );
  const [defaultUserPhoto, setDefaultUserPhoto] = React.useState(
    initialValues.defaultUserPhoto
  );
  const [phoneNumberManager, setPhoneNumberManager] = React.useState(
    initialValues.phoneNumberManager
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setDefaultVanPhoto(initialValues.defaultVanPhoto);
    setDefaultUserPhoto(initialValues.defaultUserPhoto);
    setPhoneNumberManager(initialValues.phoneNumberManager);
    setErrors({});
  };
  const validations = {
    defaultVanPhoto: [],
    defaultUserPhoto: [],
    phoneNumberManager: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          defaultVanPhoto,
          defaultUserPhoto,
          phoneNumberManager,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await API.graphql({
            query: createConfigs.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ConfigsCreateForm")}
      {...rest}
    >
      <TextField
        label="Default van photo"
        isRequired={false}
        isReadOnly={false}
        value={defaultVanPhoto}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              defaultVanPhoto: value,
              defaultUserPhoto,
              phoneNumberManager,
            };
            const result = onChange(modelFields);
            value = result?.defaultVanPhoto ?? value;
          }
          if (errors.defaultVanPhoto?.hasError) {
            runValidationTasks("defaultVanPhoto", value);
          }
          setDefaultVanPhoto(value);
        }}
        onBlur={() => runValidationTasks("defaultVanPhoto", defaultVanPhoto)}
        errorMessage={errors.defaultVanPhoto?.errorMessage}
        hasError={errors.defaultVanPhoto?.hasError}
        {...getOverrideProps(overrides, "defaultVanPhoto")}
      ></TextField>
      <TextField
        label="Default user photo"
        isRequired={false}
        isReadOnly={false}
        value={defaultUserPhoto}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              defaultVanPhoto,
              defaultUserPhoto: value,
              phoneNumberManager,
            };
            const result = onChange(modelFields);
            value = result?.defaultUserPhoto ?? value;
          }
          if (errors.defaultUserPhoto?.hasError) {
            runValidationTasks("defaultUserPhoto", value);
          }
          setDefaultUserPhoto(value);
        }}
        onBlur={() => runValidationTasks("defaultUserPhoto", defaultUserPhoto)}
        errorMessage={errors.defaultUserPhoto?.errorMessage}
        hasError={errors.defaultUserPhoto?.hasError}
        {...getOverrideProps(overrides, "defaultUserPhoto")}
      ></TextField>
      <TextField
        label="Phone number manager"
        isRequired={false}
        isReadOnly={false}
        value={phoneNumberManager}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              defaultVanPhoto,
              defaultUserPhoto,
              phoneNumberManager: value,
            };
            const result = onChange(modelFields);
            value = result?.phoneNumberManager ?? value;
          }
          if (errors.phoneNumberManager?.hasError) {
            runValidationTasks("phoneNumberManager", value);
          }
          setPhoneNumberManager(value);
        }}
        onBlur={() =>
          runValidationTasks("phoneNumberManager", phoneNumberManager)
        }
        errorMessage={errors.phoneNumberManager?.errorMessage}
        hasError={errors.phoneNumberManager?.hasError}
        {...getOverrideProps(overrides, "phoneNumberManager")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
