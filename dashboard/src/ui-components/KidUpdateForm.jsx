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
import { getKid } from "../graphql/queries";
import { updateKid } from "../graphql/mutations";
export default function KidUpdateForm(props) {
  const {
    id: idProp,
    kid: kidModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    parent1Email: "",
    parent2Email: "",
    dropOffAddress: "",
    lat: "",
    lng: "",
    birthDate: "",
    photo: "",
    Parent1ID: "",
    Parent2ID: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [parent1Email, setParent1Email] = React.useState(
    initialValues.parent1Email
  );
  const [parent2Email, setParent2Email] = React.useState(
    initialValues.parent2Email
  );
  const [dropOffAddress, setDropOffAddress] = React.useState(
    initialValues.dropOffAddress
  );
  const [lat, setLat] = React.useState(initialValues.lat);
  const [lng, setLng] = React.useState(initialValues.lng);
  const [birthDate, setBirthDate] = React.useState(initialValues.birthDate);
  const [photo, setPhoto] = React.useState(initialValues.photo);
  const [Parent1ID, setParent1ID] = React.useState(initialValues.Parent1ID);
  const [Parent2ID, setParent2ID] = React.useState(initialValues.Parent2ID);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = kidRecord
      ? { ...initialValues, ...kidRecord }
      : initialValues;
    setName(cleanValues.name);
    setParent1Email(cleanValues.parent1Email);
    setParent2Email(cleanValues.parent2Email);
    setDropOffAddress(cleanValues.dropOffAddress);
    setLat(cleanValues.lat);
    setLng(cleanValues.lng);
    setBirthDate(cleanValues.birthDate);
    setPhoto(cleanValues.photo);
    setParent1ID(cleanValues.Parent1ID);
    setParent2ID(cleanValues.Parent2ID);
    setErrors({});
  };
  const [kidRecord, setKidRecord] = React.useState(kidModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getKid.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getKid
        : kidModelProp;
      setKidRecord(record);
    };
    queryData();
  }, [idProp, kidModelProp]);
  React.useEffect(resetStateValues, [kidRecord]);
  const validations = {
    name: [{ type: "Required" }],
    parent1Email: [],
    parent2Email: [],
    dropOffAddress: [],
    lat: [],
    lng: [],
    birthDate: [],
    photo: [],
    Parent1ID: [],
    Parent2ID: [],
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
          name,
          parent1Email: parent1Email ?? null,
          parent2Email: parent2Email ?? null,
          dropOffAddress: dropOffAddress ?? null,
          lat: lat ?? null,
          lng: lng ?? null,
          birthDate: birthDate ?? null,
          photo: photo ?? null,
          Parent1ID: Parent1ID ?? null,
          Parent2ID: Parent2ID ?? null,
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
            query: updateKid.replaceAll("__typename", ""),
            variables: {
              input: {
                id: kidRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "KidUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              parent1Email,
              parent2Email,
              dropOffAddress,
              lat,
              lng,
              birthDate,
              photo,
              Parent1ID,
              Parent2ID,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Parent1 email"
        isRequired={false}
        isReadOnly={false}
        value={parent1Email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              parent1Email: value,
              parent2Email,
              dropOffAddress,
              lat,
              lng,
              birthDate,
              photo,
              Parent1ID,
              Parent2ID,
            };
            const result = onChange(modelFields);
            value = result?.parent1Email ?? value;
          }
          if (errors.parent1Email?.hasError) {
            runValidationTasks("parent1Email", value);
          }
          setParent1Email(value);
        }}
        onBlur={() => runValidationTasks("parent1Email", parent1Email)}
        errorMessage={errors.parent1Email?.errorMessage}
        hasError={errors.parent1Email?.hasError}
        {...getOverrideProps(overrides, "parent1Email")}
      ></TextField>
      <TextField
        label="Parent2 email"
        isRequired={false}
        isReadOnly={false}
        value={parent2Email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              parent1Email,
              parent2Email: value,
              dropOffAddress,
              lat,
              lng,
              birthDate,
              photo,
              Parent1ID,
              Parent2ID,
            };
            const result = onChange(modelFields);
            value = result?.parent2Email ?? value;
          }
          if (errors.parent2Email?.hasError) {
            runValidationTasks("parent2Email", value);
          }
          setParent2Email(value);
        }}
        onBlur={() => runValidationTasks("parent2Email", parent2Email)}
        errorMessage={errors.parent2Email?.errorMessage}
        hasError={errors.parent2Email?.hasError}
        {...getOverrideProps(overrides, "parent2Email")}
      ></TextField>
      <TextField
        label="Drop off address"
        isRequired={false}
        isReadOnly={false}
        value={dropOffAddress}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              parent1Email,
              parent2Email,
              dropOffAddress: value,
              lat,
              lng,
              birthDate,
              photo,
              Parent1ID,
              Parent2ID,
            };
            const result = onChange(modelFields);
            value = result?.dropOffAddress ?? value;
          }
          if (errors.dropOffAddress?.hasError) {
            runValidationTasks("dropOffAddress", value);
          }
          setDropOffAddress(value);
        }}
        onBlur={() => runValidationTasks("dropOffAddress", dropOffAddress)}
        errorMessage={errors.dropOffAddress?.errorMessage}
        hasError={errors.dropOffAddress?.hasError}
        {...getOverrideProps(overrides, "dropOffAddress")}
      ></TextField>
      <TextField
        label="Lat"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={lat}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              parent1Email,
              parent2Email,
              dropOffAddress,
              lat: value,
              lng,
              birthDate,
              photo,
              Parent1ID,
              Parent2ID,
            };
            const result = onChange(modelFields);
            value = result?.lat ?? value;
          }
          if (errors.lat?.hasError) {
            runValidationTasks("lat", value);
          }
          setLat(value);
        }}
        onBlur={() => runValidationTasks("lat", lat)}
        errorMessage={errors.lat?.errorMessage}
        hasError={errors.lat?.hasError}
        {...getOverrideProps(overrides, "lat")}
      ></TextField>
      <TextField
        label="Lng"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={lng}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              parent1Email,
              parent2Email,
              dropOffAddress,
              lat,
              lng: value,
              birthDate,
              photo,
              Parent1ID,
              Parent2ID,
            };
            const result = onChange(modelFields);
            value = result?.lng ?? value;
          }
          if (errors.lng?.hasError) {
            runValidationTasks("lng", value);
          }
          setLng(value);
        }}
        onBlur={() => runValidationTasks("lng", lng)}
        errorMessage={errors.lng?.errorMessage}
        hasError={errors.lng?.hasError}
        {...getOverrideProps(overrides, "lng")}
      ></TextField>
      <TextField
        label="Birth date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={birthDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              parent1Email,
              parent2Email,
              dropOffAddress,
              lat,
              lng,
              birthDate: value,
              photo,
              Parent1ID,
              Parent2ID,
            };
            const result = onChange(modelFields);
            value = result?.birthDate ?? value;
          }
          if (errors.birthDate?.hasError) {
            runValidationTasks("birthDate", value);
          }
          setBirthDate(value);
        }}
        onBlur={() => runValidationTasks("birthDate", birthDate)}
        errorMessage={errors.birthDate?.errorMessage}
        hasError={errors.birthDate?.hasError}
        {...getOverrideProps(overrides, "birthDate")}
      ></TextField>
      <TextField
        label="Photo"
        isRequired={false}
        isReadOnly={false}
        value={photo}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              parent1Email,
              parent2Email,
              dropOffAddress,
              lat,
              lng,
              birthDate,
              photo: value,
              Parent1ID,
              Parent2ID,
            };
            const result = onChange(modelFields);
            value = result?.photo ?? value;
          }
          if (errors.photo?.hasError) {
            runValidationTasks("photo", value);
          }
          setPhoto(value);
        }}
        onBlur={() => runValidationTasks("photo", photo)}
        errorMessage={errors.photo?.errorMessage}
        hasError={errors.photo?.hasError}
        {...getOverrideProps(overrides, "photo")}
      ></TextField>
      <TextField
        label="Parent1 id"
        isRequired={false}
        isReadOnly={false}
        value={Parent1ID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              parent1Email,
              parent2Email,
              dropOffAddress,
              lat,
              lng,
              birthDate,
              photo,
              Parent1ID: value,
              Parent2ID,
            };
            const result = onChange(modelFields);
            value = result?.Parent1ID ?? value;
          }
          if (errors.Parent1ID?.hasError) {
            runValidationTasks("Parent1ID", value);
          }
          setParent1ID(value);
        }}
        onBlur={() => runValidationTasks("Parent1ID", Parent1ID)}
        errorMessage={errors.Parent1ID?.errorMessage}
        hasError={errors.Parent1ID?.hasError}
        {...getOverrideProps(overrides, "Parent1ID")}
      ></TextField>
      <TextField
        label="Parent2 id"
        isRequired={false}
        isReadOnly={false}
        value={Parent2ID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              parent1Email,
              parent2Email,
              dropOffAddress,
              lat,
              lng,
              birthDate,
              photo,
              Parent1ID,
              Parent2ID: value,
            };
            const result = onChange(modelFields);
            value = result?.Parent2ID ?? value;
          }
          if (errors.Parent2ID?.hasError) {
            runValidationTasks("Parent2ID", value);
          }
          setParent2ID(value);
        }}
        onBlur={() => runValidationTasks("Parent2ID", Parent2ID)}
        errorMessage={errors.Parent2ID?.errorMessage}
        hasError={errors.Parent2ID?.hasError}
        {...getOverrideProps(overrides, "Parent2ID")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || kidModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || kidModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
