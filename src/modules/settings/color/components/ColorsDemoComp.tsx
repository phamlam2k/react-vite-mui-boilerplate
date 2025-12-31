type ColorsDemoCompProps = {
  color: string;
};

const ColorsDemoComp = ({ color }: ColorsDemoCompProps) => {
  return (
    <div
      className="max-w-md h-[300px] rounded-md overflow-hidden"
      style={{ border: `1px solid ${color}` }}
    >
      <div className="flex bg-white h-full rounded-md">
        <div className="w-1/5 h-full bg-background-default">
          <img
            src="/images/logo.png"
            alt="color-demo"
            className="w-1/2 object-cover mx-auto mt-3"
          />

          <div className="flex flex-col gap-4 mt-4 items-center">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-2/3 h-2 bg-background-paper" />
            ))}
          </div>
        </div>
        <div className="flex-1 h-full">
          <div className="w-full h-7 px-2 pt-2">
            <div className="w-full h-full bg-background-default rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorsDemoComp;
