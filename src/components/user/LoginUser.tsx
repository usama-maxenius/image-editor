import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import toast from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN_ID } from "../../constants";
import axios from "axios";
const steps = [
  "Select campaign settings",
  "Create an ad group",
  "Create an ad",
];
interface Tag {
  name: string;
  icon: React.ReactNode;
}

interface ChildProps {
  sendObjectToParent: (obj: any) => void;
}
const LoginUser: React.FC<ChildProps> = ({ sendObjectToParent }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //----------------------------------------------------------------
  const [name, setName] = React.useState<string>("");

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setName(event.target.value);
  // };

  //-----------------two -------------
  const [selectedTag, setSelectedTag] = React.useState<string>("");
  // const tags = [
  //   "Business",
  //   "Influencer & Digital Creator",
  //   "Education",
  //   "Entertainment",

  // ];

  const tags: Tag[] = [
    { name: "Business", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    {
      name: "Influencer & Digital Creator",
      icon: <BusinessIcon sx={{ width: "20px" }} />,
    },
    { name: "Education", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Entertainment", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Fashion & Beauty", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Food & Beverage", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    {
      name: "Government & Politics",
      icon: <BusinessIcon sx={{ width: "20px" }} />,
    },
    {
      name: "Health & Wellness",
      icon: <BusinessIcon sx={{ width: "20px" }} />,
    },
    { name: "Non-Profit", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Other", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Tech", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Travel & Tourism", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  ];

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  //-----------------three -------------
  const [selectedTag2, setSelectedTag2] = React.useState<string>("");

  const tags2: Tag[] = [
    { name: "Business", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    {
      name: "Influencer & Digital Creator",
      icon: <BusinessIcon sx={{ width: "20px" }} />,
    },
    { name: "Education", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Entertainment", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Fashion & Beauty", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Food & Beverage", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    {
      name: "Government & Politics",
      icon: <BusinessIcon sx={{ width: "20px" }} />,
    },
    {
      name: "Health & Wellness",
      icon: <BusinessIcon sx={{ width: "20px" }} />,
    },
    { name: "Non-Profit", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Other", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Tech", icon: <BusinessIcon sx={{ width: "20px" }} /> },
    { name: "Travel & Tourism", icon: <BusinessIcon sx={{ width: "20px" }} /> },
  ];

  const handleTagClick2 = (tag: string) => {
    setSelectedTag2(tag);
  };
  const handleSubmit = () => {
    if (name.length !== 0) {
      console.log("name", name);
      handleNext();
    } else {
      toast.error("Please enter a valid name");
    }
  };
  const handleSubmit2 = () => {
    if (selectedTag.length !== 0) {
      console.log("selectedTag", selectedTag);
      handleNext();
    } else {
      toast.error("Please enter a valid SelectedTag");
    }
  };

///--------------------                                             ------------------------


  ///
  const { user, getAccessTokenSilently,getIdTokenClaims } = useAuth0();
  console.log("🚀 ~ user:", user)
  const handleSubmit3 = async () => {
    let claims =  await getIdTokenClaims();    
    console.log("claims",claims);
    if (selectedTag2.length !== 0) {
      // Modify data object to set new values in user_metadata
      const data = {
        user_metadata: {
          ...user?.user_metadata, // preserve existing user_metadata
          key1: name,
          key2: selectedTag,
          key3: selectedTag2,
        },
      };
  console.log('`https://${AUTH0_DOMAIN_ID}', `https://${AUTH0_DOMAIN_ID}`)
      try {
        const accessToken = await getAccessTokenSilently();
        const url = `https://${AUTH0_DOMAIN_ID}/api/v2/users/${user?.sub}`;
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          console.log("Data saved successfully");
          sendObjectToParent(data);
          handleNext();
        } else {
          console.error("Failed to save data");
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    } else {
      toast.error("Please enter a valid SelectedTag");
    }
  };
  
  //data save
  // const { user, getAccessTokenSilently } = useAuth0();

  // Example function to call saveDataToAuth0
  // const handleSaveData = () => {
  //   const data = {
  //     name: "Saqib",
  //     selectedTag: "Education",
  //     selectedTag2: "Tech",
  //   };
  //   saveDataToAuth0(data);
  // };

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
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "30px",
                  }}
                >
                  Tell Us about yourself
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "400",
                    fontSize: "13px",
                  }}
                >
                  this will personalize your Linktree experience.
                </Typography>

                <TextField
                  id="filled-basic"
                  variant="filled"
                  label="Tell us your name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  // onChange={handleChange}
                  onChange={(event) => setName(event.target.value)}
                  required
                />

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    textTransform: "none",
                    p: 2,
                    borderRadius: "20px",
                  }}
                >
                  Continue
                </Button>
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
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "30px",
                  }}
                >
                  Tell Us about yourself
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "400",
                    fontSize: "13px",
                  }}
                >
                  This will personalize your Linktree experience.
                </Typography>

                <TextField
                  id="filled-basic"
                  variant="filled"
                  label="Tell us your name"
                  placeholder="Click a tag to select"
                  value={selectedTag}
                  onChange={(event) => setSelectedTag(event.target.value)}
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
                        color: "black",
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
                  onClick={handleSubmit2}
                  sx={{
                    textTransform: "none",
                    p: 2,
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
                  // alignItems: "center",
                  width: { md: "520px", sm: "500px", xs: "80%" },

                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "30px",
                  }}
                >
                  Tell Us about yourself
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "400",
                    fontSize: "13px",
                  }}
                >
                  this will personalize your Linktree experience.
                </Typography>

                <TextField
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
                </Box>
                <Button
                  variant="contained"
                  onClick={handleSubmit3}
                  sx={{
                    textTransform: "none",
                    p: 2,
                    borderRadius: "20px",
                  }}
                >
                  Continue
                </Button>
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
