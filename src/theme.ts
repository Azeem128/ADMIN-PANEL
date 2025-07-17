import { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  colorScheme: "light",
  colors: {
    brand: [
      "#f0faff",
      "#cce8ff",
      "#99d1ff",
      "#66baff",
      "#33a3ff",
      "#1a94ff",
      "#007bff",
      "#006ce6",
      "#005bb3",
      "#004a8c",
    ],
  },
  primaryColor: "brand",
  fontFamily: "Verdana, sans-serif",
  components: {
    Button: {
      styles: (theme) => ({
        root: {
          borderRadius: "8px",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
      }),
    },
    DatePickerInput: {
      styles: (theme) => ({
        input: {
          borderColor: "#e0e7ff",
          "&:focus": {
            borderColor: theme.colors.brand[6],
            boxShadow: `0 0 0 2px ${theme.colors.brand[4]}`,
          },
        },
      }),
    },
  },
};