import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";

import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import toast from "react-hot-toast";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAuth0 } from "@auth0/auth0-react";
import { AUTH0_DOMAIN_ID } from "../../constants";
import axios from "axios";
import { ColorResult, SketchPicker } from "react-color";
const steps = [
  "Select 1",
  "Create 2",
  "Create 3",
  "Create 4",
];
interface Tag {
  name: string;
  icon: React.ReactNode;
}

interface ChildProps {
  sendObjectToParent: (obj: any) => void;
}

// interface CustomGetTokenSilentlyOptions extends GetTokenSilentlyOptions {
//   audience: string;
//   detailedResponse?: boolean; // Making detailedResponse property optional
// }
// interface FormData {
//   userName: string;
//   color: string;
//   logoSquare: File | null;
//   logoHorizontal: File | null;
//   // fontType1: string;
//   fontType: string;
//   website: string;
//   userPhoto: File | null;
// }

const LoginUser: React.FC<ChildProps> = ({ sendObjectToParent }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  // const isStepOptional = (step: number) => {
  //   return step === 1;
  // };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleSkip = () => {
  //   if (!isStepOptional(activeStep)) {
  //     // You probably want to guard against something like this,
  //     // it should never occur unless someone's actively trying to break something.
  //     throw new Error("You can't skip a step that isn't optional.");
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values());
  //     newSkipped.add(activeStep);
  //     return newSkipped;
  //   });
  // };

  const handleReset = () => {
    setActiveStep(0);
  };

  //----------------------------------------------------------------
  // const [name, setName] = React.useState<string>("");

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setName(event.target.value);
  // };

  //-----------------two -------------
  const tags: Tag[] = [
    { name: "#Gaming", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    {
      name: "#Xbox",
      icon: <BusinessIcon sx={{ width: "20px" }} />,
    },
    { name: "#Playstation", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "#Virtual Reality", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "#PC Gaming etc", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  ];
  // const [selectedTag, setSelectedTag] = React.useState<string>("");
  // const handleTagClick = (tag: string) => {
  //   setSelectedTag(tag);
  // };

  const [checkbox1Checked, setCheckbox1Checked] =
    React.useState<boolean>(false);
  const [checkbox2Checked, setCheckbox2Checked] =
    React.useState<boolean>(false);
  const [checkbox3Checked, setCheckbox3Checked] = React.useState<boolean>(true);

  const handleCheckbox1Change = () => {
    setCheckbox1Checked(true);
    setCheckbox2Checked(false);
    setCheckbox3Checked(false);
  };

  const handleCheckbox2Change = () => {
    setCheckbox1Checked(false);
    setCheckbox2Checked(true);
    setCheckbox3Checked(false);
  };

  const handleCheckbox3Change = () => {
    setCheckbox1Checked(false);
    setCheckbox2Checked(false);
    setCheckbox3Checked(true);
  };

  const [color, setColor] = React.useState<string>("#ffffff");
  const [userName, setUserName] = React.useState<string>("");
  const [fontType, setFontType] = React.useState<string>("");
  const [website, setWebsite] = React.useState<string>("");
  const [logo, setLogo] = React.useState<File | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [dateTime, setDateTime] = React.useState<string>("");

  const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(event.target.value);
  };

  const handleTagClick = (tagName: string) => {
    if (selectedTags?.includes(tagName)) {
      setSelectedTags(selectedTags?.filter((tag) => tag !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSubmitOne = async () => {
    if (dateTime.trim() === "") {
      toast.error("Please select a date and time");
      return;
    }
    if (selectedTags.length !== 0) {
      handleNext();
      const data = {
        user_metadata: {
          name: userName,
          color: color,
          fontType: fontType,
          website: website,
          logo: logo,
          selectedTags: selectedTags,
          dateTime: dateTime,
        },
      };
      console.log("data", data);
      // const accessToken = await getAccessTokenSilently();

      // try {
      //   // const accessToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InlXeDdWcDdYdXZ5VEJUMi1UVGpVNyJ9.eyJpc3MiOiJodHRwczovL2Rldi1iZzhvd2hqM2VxeGRhNzY0LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJVTGpRNXdRZUx4aENITlk2d0NMVjBNblFPaGhYT2paakBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtYmc4b3doajNlcXhkYTc2NC51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTcwOTAyMTk1MSwiZXhwIjoxNzA5MTA4MzUxLCJhenAiOiJVTGpRNXdRZUx4aENITlk2d0NMVjBNblFPaGhYT2paaiIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zX3N1bW1hcnkgY3JlYXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgcmVhZDphdXRoZW50aWNhdGlvbl9tZXRob2RzIHVwZGF0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIGRlbGV0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIHJlYWQ6b3JnYW5pemF0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcnMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVycyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGNyZWF0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyByZWFkOnNjaW1fY29uZmlnIGNyZWF0ZTpzY2ltX2NvbmZpZyB1cGRhdGU6c2NpbV9jb25maWcgZGVsZXRlOnNjaW1fY29uZmlnIGNyZWF0ZTpzY2ltX3Rva2VuIHJlYWQ6c2NpbV90b2tlbiBkZWxldGU6c2NpbV90b2tlbiBkZWxldGU6cGhvbmVfcHJvdmlkZXJzIGNyZWF0ZTpwaG9uZV9wcm92aWRlcnMgcmVhZDpwaG9uZV9wcm92aWRlcnMgdXBkYXRlOnBob25lX3Byb3ZpZGVycyBkZWxldGU6cGhvbmVfdGVtcGxhdGVzIGNyZWF0ZTpwaG9uZV90ZW1wbGF0ZXMgcmVhZDpwaG9uZV90ZW1wbGF0ZXMgdXBkYXRlOnBob25lX3RlbXBsYXRlcyBjcmVhdGU6ZW5jcnlwdGlvbl9rZXlzIHJlYWQ6ZW5jcnlwdGlvbl9rZXlzIHVwZGF0ZTplbmNyeXB0aW9uX2tleXMgZGVsZXRlOmVuY3J5cHRpb25fa2V5cyByZWFkOnNlc3Npb25zIGRlbGV0ZTpzZXNzaW9ucyByZWFkOnJlZnJlc2hfdG9rZW5zIGRlbGV0ZTpyZWZyZXNoX3Rva2VucyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.abOoJ57SB0S9xT8-oRW_yMy2iuQcwsnxSqW1ywh3K9mcEuT9FLCA2sW-KWb8MSs3yylxoZTylZYo4-kNkQiD1VmliMxPG94tf7HWrUtpDamurSBio4t4iMftOB5V3tZoHw2BM_yaAlAAW1Z9h-gzy9JpTv6SpN4YwEvDXq1lH0DcDvN2tNZfoc8BtKjZibdTUb7p6pEiv1EzOXg17VXSALa47DHN46gjCuc3mpDTKAiBgA_PWh4g2Y8ygpQtehvCpkg0Hu-lA7p_n6hByX3603P1LQ_q1phwYgWzg-Odmw2_W5R_RbirfMgkIv1Xr1RCuzPjeGJwMuizOZHFaFpP4A`;
      //   const url = `https://${AUTH0_DOMAIN_ID}/api/v2/users/${user?.sub}`;
      //   const headers = {
      //     Authorization: `Bearer ${accessToken}`,
      //     "Content-Type": "application/json",
      //   };
      //   const response = await axios.patch(url, data, {
      //     headers: headers,
      //   });

      //   if (response.status === 200) {
      //     console.log("Data saved successfully", response?.data);
      //     toast.success("Data saved successfully");
      //     sendObjectToParent(data);
      //     handleNext();
      //   } else {
      //     console.error("Failed to save data:", response.data);
      //   }
      // } catch (error) {
      //   console.error("Error saving data:", error);
      //   if (error) {
      //     console.error("Error response:", error);
      //   }
      // }
      console.log("selectedTag", data);

      // handleNext();
    } else {
      toast.error("Please enter a valid SelectedTag");
    }
  };
  //-----------------three -------------
  // const [selectedTag2, setSelectedTag2] = React.useState<string>("");

  // const tags2: Tag[] = [
  //   { name: "Business", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  //   {
  //     name: "Influencer & Digital Creator",
  //     icon: <BusinessIcon sx={{ width: "20px" }} />,
  //   },
  //   { name: "Education", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  //   { name: "Entertainment", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  //   { name: "Fashion & Beauty", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  //   { name: "Food & Beverage", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  //   {
  //     name: "Government & Politics",
  //     icon: <BusinessIcon sx={{ width: "20px" }} />,
  //   },
  //   {
  //     name: "Health & Wellness",
  //     icon: <BusinessIcon sx={{ width: "20px" }} />,
  //   },
  //   { name: "Non-Profit", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  //   { name: "Other", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  //   { name: "Tech", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  //   { name: "Travel & Tourism", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  // ];

  // const handleTagClick2 = (tag: string) => {
  //   setSelectedTag2(tag);
  // };
  // // const handleSubmit = () => {
  // //   if (name.length !== 0) {
  // //     console.log("name", name);
  // //     handleNext();
  // //   } else {
  // //     toast.error("Please enter a valid name");
  // //   }
  // // };
  // const handleSubmit2 = () => {
  //   if (selectedTag2.length !== 0) {
  //     console.log("selectedTag", selectedTag2);
  //     handleNext();
  //   } else {
  //     toast.error("Please enter a valid SelectedTag");
  //   }
  // };

  // const saveSettings = () => {
  //   // Here you can send a request to the backend to save the settings
  //   console.log('Saving settings:', dateTime);
  // };
  //___________________________________________________________________

  // const getUserMetadata = async () => {
  //   const { user, getAccessTokenSilently } = useAuth0();
  //   console.log("🚀 ~user ------", user)
  //   const accessToken = await getAccessTokenSilently();
  //   const url = "https://" + AUTH0_DOMAIN_ID + "/api/v2/users/" + user?.sub;
  //   const headers = {
  //     Authorization: `Bearer ${accessToken}`,
  //     "Content-Type": "application/json",
  //   };
  //   const result = await axios.get(url, {
  //     method: "GET",
  //     headers: headers,
  //   });
  //   const data = await result;
  //   console.log("data", data);

  // //   if (
  // //     !data?.data?.user_metadata?.key1 &&
  // //     !data?.data?.user_metadata?.key2 &&
  // //     !data?.data?.user_metadata?.key3
  // //   ) {
  // //     toast.success("box one");
  // //     console.log('first123')
  // //   } else {
  // //     // sendObjectToParent(data);
  // //   }
  // //   console.log("data", data);
  // };

  // getUserMetadata();

  //_____________________________________________________________________
  const { user, getAccessTokenSilently } = useAuth0();

  // console.log("🚀 ~ user:", user);
  const handleSubmit3 = async () => {
    if (selectedTags.length !== 0) {
      const data = {
        user_metadata: {
          name: userName,
          color: color,
          fontType: fontType,
          website: website,
          logo: logo,
          selectedTags: selectedTags,
          dateTime: dateTime,
          freeTrail: checkbox1Checked,
          starterTrail: checkbox2Checked,
          proTrail: checkbox3Checked,
        },
      };

      const accessToken = await getAccessTokenSilently();

      try {
        // const accessToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InlXeDdWcDdYdXZ5VEJUMi1UVGpVNyJ9.eyJpc3MiOiJodHRwczovL2Rldi1iZzhvd2hqM2VxeGRhNzY0LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJVTGpRNXdRZUx4aENITlk2d0NMVjBNblFPaGhYT2paakBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtYmc4b3doajNlcXhkYTc2NC51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTcwOTAyMTk1MSwiZXhwIjoxNzA5MTA4MzUxLCJhenAiOiJVTGpRNXdRZUx4aENITlk2d0NMVjBNblFPaGhYT2paaiIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zX3N1bW1hcnkgY3JlYXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgcmVhZDphdXRoZW50aWNhdGlvbl9tZXRob2RzIHVwZGF0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIGRlbGV0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIHJlYWQ6b3JnYW5pemF0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcnMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVycyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGNyZWF0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyByZWFkOnNjaW1fY29uZmlnIGNyZWF0ZTpzY2ltX2NvbmZpZyB1cGRhdGU6c2NpbV9jb25maWcgZGVsZXRlOnNjaW1fY29uZmlnIGNyZWF0ZTpzY2ltX3Rva2VuIHJlYWQ6c2NpbV90b2tlbiBkZWxldGU6c2NpbV90b2tlbiBkZWxldGU6cGhvbmVfcHJvdmlkZXJzIGNyZWF0ZTpwaG9uZV9wcm92aWRlcnMgcmVhZDpwaG9uZV9wcm92aWRlcnMgdXBkYXRlOnBob25lX3Byb3ZpZGVycyBkZWxldGU6cGhvbmVfdGVtcGxhdGVzIGNyZWF0ZTpwaG9uZV90ZW1wbGF0ZXMgcmVhZDpwaG9uZV90ZW1wbGF0ZXMgdXBkYXRlOnBob25lX3RlbXBsYXRlcyBjcmVhdGU6ZW5jcnlwdGlvbl9rZXlzIHJlYWQ6ZW5jcnlwdGlvbl9rZXlzIHVwZGF0ZTplbmNyeXB0aW9uX2tleXMgZGVsZXRlOmVuY3J5cHRpb25fa2V5cyByZWFkOnNlc3Npb25zIGRlbGV0ZTpzZXNzaW9ucyByZWFkOnJlZnJlc2hfdG9rZW5zIGRlbGV0ZTpyZWZyZXNoX3Rva2VucyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.abOoJ57SB0S9xT8-oRW_yMy2iuQcwsnxSqW1ywh3K9mcEuT9FLCA2sW-KWb8MSs3yylxoZTylZYo4-kNkQiD1VmliMxPG94tf7HWrUtpDamurSBio4t4iMftOB5V3tZoHw2BM_yaAlAAW1Z9h-gzy9JpTv6SpN4YwEvDXq1lH0DcDvN2tNZfoc8BtKjZibdTUb7p6pEiv1EzOXg17VXSALa47DHN46gjCuc3mpDTKAiBgA_PWh4g2Y8ygpQtehvCpkg0Hu-lA7p_n6hByX3603P1LQ_q1phwYgWzg-Odmw2_W5R_RbirfMgkIv1Xr1RCuzPjeGJwMuizOZHFaFpP4A`;
        const url = `https://${AUTH0_DOMAIN_ID}/api/v2/users/${user?.sub}`;
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.patch(url, data, {
          headers: headers,
        });

        if (response.status === 200) {
          console.log("Data saved successfully", response?.data);
          toast.success("Data saved successfully");
          sendObjectToParent(data);
          handleNext();
        } else {
          console.error("Failed to save data:", response.data);
        }
      } catch (error) {
        console.error("Error saving data:", error);
        if (error) {
          console.error("Error response:", error);
        }
      }
      console.log("selectedTag", data);

      // handleNext();
    } else {
      toast.error("Please enter a valid SelectedTag");
    }
    // if (selectedTag2.length !== 0) {
    //   const data = {
    //     user_metadata: {
    //       key1: name,
    //       key2: selectedTags,
    //       key3: selectedTag2,
    //     },
    //   };
    //   // getUserMetadata();
    //   const accessToken = await getAccessTokenSilently();

    //   try {
    //     // const accessToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InlXeDdWcDdYdXZ5VEJUMi1UVGpVNyJ9.eyJpc3MiOiJodHRwczovL2Rldi1iZzhvd2hqM2VxeGRhNzY0LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJVTGpRNXdRZUx4aENITlk2d0NMVjBNblFPaGhYT2paakBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtYmc4b3doajNlcXhkYTc2NC51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTcwOTAyMTk1MSwiZXhwIjoxNzA5MTA4MzUxLCJhenAiOiJVTGpRNXdRZUx4aENITlk2d0NMVjBNblFPaGhYT2paaiIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zX3N1bW1hcnkgY3JlYXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgcmVhZDphdXRoZW50aWNhdGlvbl9tZXRob2RzIHVwZGF0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIGRlbGV0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIHJlYWQ6b3JnYW5pemF0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcnMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVycyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGNyZWF0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyByZWFkOnNjaW1fY29uZmlnIGNyZWF0ZTpzY2ltX2NvbmZpZyB1cGRhdGU6c2NpbV9jb25maWcgZGVsZXRlOnNjaW1fY29uZmlnIGNyZWF0ZTpzY2ltX3Rva2VuIHJlYWQ6c2NpbV90b2tlbiBkZWxldGU6c2NpbV90b2tlbiBkZWxldGU6cGhvbmVfcHJvdmlkZXJzIGNyZWF0ZTpwaG9uZV9wcm92aWRlcnMgcmVhZDpwaG9uZV9wcm92aWRlcnMgdXBkYXRlOnBob25lX3Byb3ZpZGVycyBkZWxldGU6cGhvbmVfdGVtcGxhdGVzIGNyZWF0ZTpwaG9uZV90ZW1wbGF0ZXMgcmVhZDpwaG9uZV90ZW1wbGF0ZXMgdXBkYXRlOnBob25lX3RlbXBsYXRlcyBjcmVhdGU6ZW5jcnlwdGlvbl9rZXlzIHJlYWQ6ZW5jcnlwdGlvbl9rZXlzIHVwZGF0ZTplbmNyeXB0aW9uX2tleXMgZGVsZXRlOmVuY3J5cHRpb25fa2V5cyByZWFkOnNlc3Npb25zIGRlbGV0ZTpzZXNzaW9ucyByZWFkOnJlZnJlc2hfdG9rZW5zIGRlbGV0ZTpyZWZyZXNoX3Rva2VucyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.abOoJ57SB0S9xT8-oRW_yMy2iuQcwsnxSqW1ywh3K9mcEuT9FLCA2sW-KWb8MSs3yylxoZTylZYo4-kNkQiD1VmliMxPG94tf7HWrUtpDamurSBio4t4iMftOB5V3tZoHw2BM_yaAlAAW1Z9h-gzy9JpTv6SpN4YwEvDXq1lH0DcDvN2tNZfoc8BtKjZibdTUb7p6pEiv1EzOXg17VXSALa47DHN46gjCuc3mpDTKAiBgA_PWh4g2Y8ygpQtehvCpkg0Hu-lA7p_n6hByX3603P1LQ_q1phwYgWzg-Odmw2_W5R_RbirfMgkIv1Xr1RCuzPjeGJwMuizOZHFaFpP4A`;
    //     const url = `https://${AUTH0_DOMAIN_ID}/api/v2/users/${user?.sub}`;
    //     const headers = {
    //       Authorization: `Bearer ${accessToken}`,
    //       "Content-Type": "application/json",
    //     };
    //     const response = await axios.patch(url, data, {
    //       headers: headers,
    //     });

    //     if (response.status === 200) {
    //       console.log("Data saved successfully", response?.data);
    //       sendObjectToParent(data);
    //       handleNext();
    //     } else {
    //       console.error("Failed to save data:", response.data);
    //     }
    //   } catch (error) {
    //     console.error("Error saving data:", error);
    //     if (error) {
    //       console.error("Error response:", error);
    //     }
    //   }
    // } else {
    //   toast.error("Please enter a valid SelectedTag");
    // }
  };

  //---------------------------------------------

  // const [formData, setFormData] = React.useState<FormData>({
  //   userName: "",
  //   color: "",
  //   logoSquare: null,
  //   logoHorizontal: null,
  //   fontType: "",
  //   website: "",
  //   userPhoto: null,
  // });

  //COLOR PICKER

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleColorChange = (newColor: ColorResult) => {
    setColor(newColor.hex);
    setAnchorEl(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
    if (isValidHex) {
      setColor(value);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "color-popover" : undefined;

  //----------

  const handleSubmit4 =() =>{
    handleNext();
  }
  // const handleChange = (e: any) => {
  //   const { name, value, files } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: files ? files[0] : value,
  //   });
  // };

  const handleSubmit1 = (e: any) => {
    e.preventDefault();

    // if (!logo) {
    //   toast.error("Kindly upload logo");
    //   return;
    // }
    toast.success("Upload successfully");
    handleNext();
    console.log("🚀 ~ logo:", logo);

    console.log(
      "userName",
      userName,
      "color",
      color,
      "fontType",
      fontType,
      "website",
      website
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          // if (isStepOptional(index)) {
          //   labelProps.optional = (
          //     <Typography variant="caption">Optional</Typography>
          //   );
          // }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper> */}
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1, color: "red" }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* <Typography sx={{ mt: 2, mb: 1, color: "black" }}>
            Step {activeStep + 1}
          </Typography> */}

          {activeStep === 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: { md: "520px", sm: "500px", xs: "80%" },
                  flexDirection: "column",
                  gap: 3,
                  mt: 2,
                  // border: "1px solid",
                  p: 2,
                  boxShadow:
                    "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "30px",
                    textAlign: "center",
                  }}
                >
                  Tell us about yourself
                </Typography>
                <form onSubmit={handleSubmit1}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: "column",
                    }}
                  >
                    {/* Upload user photo */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {logo && (
                        <img
                          src={URL.createObjectURL(logo)}
                          alt="User Photo"
                          width={"100px"}
                          height={"100px"}
                          style={{ marginLeft: "10px", borderRadius: "50%" }}
                        />
                      )}
                    </Box>
                    <TextField
                      name="userName"
                      label="Company/Brand/Social Media Account User Name"
                      variant="outlined"
                      value={userName}
                      onChange={(event) => setUserName(event.target.value)}
                      fullWidth
                      required
                    />

                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <TextField
                        id="color-field"
                        label="Choose a color"
                        value={color}
                        onChange={handleInputChange}
                        onClick={handleClick}
                        variant="outlined"
                        fullWidth
                      />
                      <Box
                        sx={{
                          marginTop: "10px",
                          width: { md: "70%", sm: "70%", xs: "50%" },
                          height: "36px",
                          backgroundColor: color,
                          position: "absolute",
                          right: 10,
                          top: 0,
                        }}
                      ></Box>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        <SketchPicker
                          color={color}
                          onChange={handleColorChange}
                        />
                      </Popover>
                    </div>

                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="font-type-label">
                        Select Font Type
                      </InputLabel>
                      <Select
                        labelId="font-type-label"
                        id="font-type-select"
                        value={fontType}
                        onChange={(event) => setFontType(event.target.value)}
                        label="Select Font Type"
                        name="fontType"
                      >
                        <MenuItem value="Arial">Arial</MenuItem>
                        <MenuItem value="Times New Roman">
                          Times New Roman
                        </MenuItem>
                        <MenuItem value="Verdana">Verdana</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      name="website"
                      label="Company/Brand Website optional"
                      variant="outlined"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                      fullWidth
                      // required
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #C4C4C4",
                        py: 1,
                        backgroundColor: logo ? "#C4C4C4" : null,
                      }}
                    >
                      <label
                        htmlFor="upload-photo"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          id="upload-photo"
                          type="file"
                          name="userPhoto"
                          accept="image/png, image/jpeg"
                          required
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) =>
                            setLogo(
                              event.target.files ? event.target.files[0] : null
                            )
                          }
                          style={{
                            position: "absolute",
                            width: "1px",
                            height: "1px",
                            padding: "0",
                            margin: "-1px",
                            overflow: "hidden",
                            clip: "rect(0, 0, 0, 0)",
                            border: "0",
                            cursor: "pointer",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <span style={{ marginRight: "0.5rem" }}>
                            <i className="fas fa-file-image"></i>
                          </span>
                          <CloudUploadIcon sx={{ fontSize: "36px" }} />
                        </div>
                      </label>
                      <label
                        htmlFor="upload-photo"
                        style={{ marginLeft: "0.5rem" }}
                      >
                        {logo ? logo.name : "Select File"}
                      </label>
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: "20px",
                      }}
                    >
                      Continue
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  // alignItems: "center",
                  width: { md: "520px", sm: "500px", xs: "80%" },
                  flexDirection: "column",
                  gap: 3,
                  p: 2,
                  boxShadow:
                    "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "30px",
                    textAlign: "center",
                  }}
                >
                  Tell us about yourself
                </Typography>

                <TextField
                  id="datetime"
                  label="Preferred Date and Time"
                  type="datetime-local"
                  value={dateTime}
                  required
                  onChange={handleDateTimeChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="filled-basic"
                  variant="filled"
                  label="Tell us your name"
                  placeholder="Click a tag to select"
                  value={selectedTags.join(", ")} // Display selected tags as comma-separated string
                  onChange={(event) =>
                    setSelectedTags(event.target.value.split(", "))
                  }
                  required
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {tags.map((tag, index) => (
                    <Button
                      key={index}
                      sx={{
                        marginRight: "10px",
                        cursor: "pointer",
                        color: selectedTags.includes(tag?.name)
                          ? "white"
                          : "black", // Change text color based on selection
                        backgroundColor: selectedTags.includes(tag?.name)
                          ? "#4B1248"
                          : "transparent", // Highlight selected tags
                        border: "1px solid",
                        borderRadius: "20px",
                        px: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                      }}
                      onClick={() => handleTagClick(tag.name)}
                    >
                      {tag.icon}
                      {tag.name}
                    </Button>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  onClick={handleSubmitOne}
                  sx={{
                    textTransform: "none",
                    py: 1.5,
                    borderRadius: "20px",
                  }}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: { md: "90%", sm: "95%", xs: "98%" },
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "30px",
                    textAlign: "center",
                  }}
                >
                  Find the plane for you
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "400",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  You can change at anytime
                </Typography>

                {/* <TextField
                  id="filled-basic"
                  variant="filled"
                  label="Tell us your name"
                  placeholder="Click a tag to select"
                  value={selectedTag2}
                  onChange={(event) => setSelectedTag2(event.target.value)}
                  required // Sets the field as required
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {tags2.map((tag, index) => (
                    <Button
                      key={index}
                      sx={{
                        marginRight: "10px",
                        cursor: "pointer",
                        color: "black",
                        border: "1px solid",
                        borderRadius: "20px",
                        px: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                      }}
                      onClick={() => handleTagClick2(tag.name)}
                    >
                      {tag.icon}
                      {tag.name}
                    </Button>
                  ))}
                </Box> */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        minHeight: 500,
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        //  p:2,
                        borderRadius: "30px",
                        height: "100%",

                        boxShadow:
                          "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "24px",
                              fontWeight: "bold",
                            }}
                          >
                            Free
                          </Typography>
                          {/* <Checkbox {...label} /> */}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkbox1Checked}
                                onChange={handleCheckbox1Change}
                              />
                            }
                            label=""
                          />
                        </Box>
                        <Typography sx={{ p: 2, fontWeight: 600 }}>
                          For your personal Link tree
                        </Typography>

                        <Divider />
                        <Typography
                          sx={{
                            p: 2,
                            fontSize: "18px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                          }}
                        >
                          For your personal Link tree
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            px: 2,
                          }}
                        >
                          <CheckIcon sx={{ color: "#E04BED" }} />
                          <Typography
                            sx={{
                              py: 2,
                              pl: 0.5,
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                            }}
                          >
                            Unlimited Links
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Box sx={{ p: 2 }}>
                          <Typography
                            sx={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              fontFamily: "Roboto",
                            }}
                          >
                            Free
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                            }}
                          >
                            Free, Forever
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        minHeight: 500,
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        height: "100%",

                        borderRadius: "30px",
                        boxShadow:
                          "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "24px",
                              fontWeight: "bold",
                            }}
                          >
                            Starter
                          </Typography>
                          {/* <Checkbox {...label} /> */}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkbox2Checked}
                                onChange={handleCheckbox2Change}
                              />
                            }
                            label=""
                          />
                        </Box>
                        <Typography sx={{ p: 2, fontWeight: 600 }}>
                          For growing influences
                        </Typography>

                        <Divider />
                        <Typography
                          sx={{
                            p: 2,
                            fontSize: "18px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                          }}
                        >
                          For growing influences
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            px: 2,
                            pb: 1,
                          }}
                        >
                          <CheckIcon sx={{ color: "#E04BED" }} />
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            Upgrade Style Options
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            px: 2,
                            pb: 1,
                          }}
                        >
                          <CheckIcon sx={{ color: "#E04BED" }} />
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            Monetization support w/affiliate marketing tools
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            px: 2,
                            pb: 1,
                          }}
                        >
                          <CheckIcon sx={{ color: "#E04BED" }} />
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            Scheduling
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            px: 2,
                            pb: 1,
                          }}
                        >
                          <CheckIcon sx={{ color: "#E04BED" }} />
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            Audience insights
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Box sx={{ p: 2 }}>
                          <Typography
                            sx={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              fontFamily: "Roboto",
                            }}
                          >
                            $4 USD
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            Per month, billed annually, or $5 billed monthly
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        minHeight: 500,
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        height: "100%",

                        borderRadius: "30px",
                        boxShadow:
                          "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            backgroundColor: "#502274",
                            borderRadius: "30px 30px 0px 0px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              color: "white",
                            }}
                          >
                            Pro
                          </Typography>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkbox3Checked}
                                onChange={handleCheckbox3Change}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "white",
                                  },
                                }}
                              />
                            }
                            label=""
                          />
                        </Box>
                        <Typography
                          sx={{
                            p: 2,
                            fontWeight: 600,
                            backgroundColor: "#502274",
                            color: "white",
                          }}
                        >
                          For creators and businesses
                        </Typography>

                        {/* </Box> */}
                        <Divider />
                        <Typography
                          sx={{
                            p: 2,
                            fontSize: "18px",
                            fontWeight: 600,
                            fontFamily: "Roboto",
                          }}
                        >
                          For creators and businesses
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            px: 2,
                            pb: 1,
                          }}
                        >
                          <CheckIcon sx={{ color: "#E04BED" }} />
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            Advanced customization of buttons, themes, and fonts
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            px: 2,
                            pb: 1,
                          }}
                        >
                          <CheckIcon sx={{ color: "#E04BED" }} />
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            Click, conversion, and revenue tracking
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            px: 2,
                            pb: 1,
                          }}
                        >
                          <CheckIcon sx={{ color: "#E04BED" }} />
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            Upgraded customer support
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            px: 2,
                            pb: 1,
                          }}
                        >
                          <CheckIcon sx={{ color: "#E04BED" }} />
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            Option to hide Linktree logo
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            px: 2,
                            pb: 1,
                          }}
                        >
                          <CheckIcon sx={{ color: "#E04BED" }} />
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            Social platform integrations to automatically
                            display your latest content
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Box sx={{ p: 2 }}>
                          <Typography
                            sx={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              fontFamily: "Roboto",
                            }}
                          >
                            Free for 30 days
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: 500,
                              fontFamily: "Roboto",
                              color: "#666666",
                            }}
                          >
                            $7.50 per month, billed annually, or $9 billed
                            monthly
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  onClick={handleSubmit4}
                  sx={{
                    textTransform: "none",
                    p: 2,
                    borderRadius: "20px",

                    width: { md: "50%", sm: "70%", xs: "90%" },
                  }}
                >
                  Try Pro for free
                </Button>
              </Box>
            </Box>
          )}
          {activeStep === 3 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  // alignItems: "center",
                  width: { md: "520px", sm: "500px", xs: "80%" },
                  flexDirection: "column",
                  gap: 3,
                  p: 2,
                  boxShadow:
                    "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                }}
              >
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: { md: "90%", sm: "95%", xs: "98%" },
                  flexDirection: "column",
                  gap: 3,
                }}
              > */}
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "30px",
                    textAlign: "center",
                    mt:2
                  }}
                >
                 Thanks for signing up
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "400",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  To verify your account, click on the link sent to your inbox
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "400",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  (ancientcitizens@hotmail.com)
                </Typography>

                <Button
                  variant="contained"
                  onClick={handleSubmit3}
                  sx={{
                    textTransform: "none",
                    py: 1.5,
                    borderRadius: "20px",

                    width: "100%",
                  }}
                >
                 Continue
                </Button>

                {/* <Button
                      type="submit"
                      onClick={handleSubmit3}
                      variant="contained"
                      color="primary"
                      sx={{
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: "20px",
                      }}
                    >
                      Continue
                    </Button> */}
            
              </Box>
            </Box>
          )}

          {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box> */}
        </React.Fragment>
      )}
    </Box>
  );
};
export default LoginUser;
