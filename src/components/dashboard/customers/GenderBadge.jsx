"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbGenderFemale, TbGenderMale, TbGenderNeutrois } from "react-icons/tb";

const GENDER_STATUSES = {
  MALE: {
    value: "MALE",
    label: "Male",
    color: "blue",
    icon: <TbGenderMale size={14} />
  },
  FEMALE: {
    value: "FEMALE",
    label: "Female",
    color: "fuchsia",
    icon: <TbGenderFemale size={14} />
  },
  NOT_FOUND: {
    value: "NOT_FOUND",
    label: "Not Specified",
    color: "gray",
    icon: <TbGenderNeutrois size={14} />
  },
};

export const GENDER_STATUSES_LIST = Object.values(GENDER_STATUSES);

export const genderStatusMatcher = (value) =>
  match(value)
    .with("MALE", () => GENDER_STATUSES.MALE)
    .with("FEMALE", () => GENDER_STATUSES.FEMALE)
    .with("NOT_FOUND", () => GENDER_STATUSES.NOT_FOUND)
    .otherwise(() => GENDER_STATUSES.NOT_FOUND); // Default fallback

export function GenderBadge({ value, customSx = {} }) {
  // Handle case sensitivity by converting to uppercase
  const normalizedValue = value?.toUpperCase() || "NOT_FOUND";
  const genderMeta = genderStatusMatcher(normalizedValue);
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        padding: 0,
        backgroundColor: `${genderMeta.color}.50`,
        color: `${genderMeta.color}.800`,
        fontWeight: 500,
        borderRadius: 1,
        borderColor: `${genderMeta.color}.200`,
        borderWidth: 1,
        borderStyle: "solid",
        px: 0.75,
        py: 0.25,
        fontSize: "xs",
        ...customSx,
      }}
    >
      {genderMeta.icon}
      {genderMeta.label}
    </Box>
  );
} 