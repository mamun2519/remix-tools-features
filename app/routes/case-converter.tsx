import React from "react";

const CaseConverter = () => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isGenerating = navigation.state === "submitting";
  return <div>This is case converter</div>;
};

export default CaseConverter;
