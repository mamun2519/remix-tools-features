const CaseConverter = () => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isGenerating = navigation.state === "submitting";
  return (
    <div className="p-10">
      <div className="mt-10 h-full rounded border p-6">
        <h3>Text Converter</h3>

        <div className="mt-2">
          <div>
            <textarea
              rows={10}
              cols={50}
              name="videoURL"
              placeholder="Enter your text here..."
              className="h-14 w-96 rounded border px-4 outline-slate-300"
            />

            <button
              type="submit"
              className="h-14 border bg-red-400 px-4 font-bold text-white"
            >
              {isGenerating ? "Summarizing..." : "Summarize"}
            </button>
          </div>
        </div>

        {actionData?.error && (
          <div className="mt-4 text-center text-red-600">
            {actionData.error}
          </div>
        )}

        {actionData?.transcript && (
          <>
            <div className="text-md mt-10 max-h-[400px] overflow-y-auto rounded-md border p-4 text-justify">
              {actionData?.transcript?.map((line, index) => {
                return (
                  <div key={index} className={index !== 0 && "mt-4"}>
                    <span className="text-gray-90">{line}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CaseConverter;
