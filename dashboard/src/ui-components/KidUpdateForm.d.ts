/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Kid } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type KidUpdateFormInputValues = {
    name?: string;
    parent1Email?: string;
    parent2Email?: string;
    dropOffAddress?: string;
    lat?: number;
    lng?: number;
    birthDate?: string;
    photo?: string;
};
export declare type KidUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    parent1Email?: ValidationFunction<string>;
    parent2Email?: ValidationFunction<string>;
    dropOffAddress?: ValidationFunction<string>;
    lat?: ValidationFunction<number>;
    lng?: ValidationFunction<number>;
    birthDate?: ValidationFunction<string>;
    photo?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type KidUpdateFormOverridesProps = {
    KidUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    parent1Email?: PrimitiveOverrideProps<TextFieldProps>;
    parent2Email?: PrimitiveOverrideProps<TextFieldProps>;
    dropOffAddress?: PrimitiveOverrideProps<TextFieldProps>;
    lat?: PrimitiveOverrideProps<TextFieldProps>;
    lng?: PrimitiveOverrideProps<TextFieldProps>;
    birthDate?: PrimitiveOverrideProps<TextFieldProps>;
    photo?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type KidUpdateFormProps = React.PropsWithChildren<{
    overrides?: KidUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    kid?: Kid;
    onSubmit?: (fields: KidUpdateFormInputValues) => KidUpdateFormInputValues;
    onSuccess?: (fields: KidUpdateFormInputValues) => void;
    onError?: (fields: KidUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: KidUpdateFormInputValues) => KidUpdateFormInputValues;
    onValidate?: KidUpdateFormValidationValues;
} & React.CSSProperties>;
export default function KidUpdateForm(props: KidUpdateFormProps): React.ReactElement;
