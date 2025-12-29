type ColorsDemoCompProps = {
  color: string;
};

const ColorsDemoComp = ({ color }: ColorsDemoCompProps) => {
  return (
    <div className="flex max-w-md h-[300px]">
      <div className="w-1/5 h-full" style={{ backgroundColor: color }}>
        <img
          src="/images/logo.png"
          alt="color-demo"
          className="w-1/2 object-cover mx-auto mt-3"
        />
      </div>
      <div className="flex-1 h-full">
        <div className="w-full h-10" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
};

export default ColorsDemoComp;
