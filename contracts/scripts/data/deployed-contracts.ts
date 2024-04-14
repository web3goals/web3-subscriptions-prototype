export const CONTRACTS: {
  [key: string]: {
    entryPoint: `0x${string}` | undefined;
    accountFactory: `0x${string}` | undefined;
    paymaster: `0x${string}` | undefined;
    product: `0x${string}` | undefined;
    usdToken: `0x${string}` | undefined;
  };
} = {
  etherlinkTestnet: {
    entryPoint: "0x539dA825856778B593a55aC4E8A0Ec1441f18e78",
    accountFactory: "0xBBae3088AaF60c44Fb932ba82fd0b3dbb2d67C6F",
    paymaster: "0x57d1469c53Bb259Dc876A274ADd329Eb703Ab286",
    product: "0x86916184b00b26dceaF63a2cD6c9095314f6e055",
    usdToken: "0xe720443310986E173af339fA366A30aa0A1Ea5b2",
  },
  shardeumTestnet: {
    entryPoint: "0x02008a8DBc938bd7930bf370617065B6B0c1221a",
    accountFactory: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    paymaster: "0x1e4712A93beEc0aa26151CF44061eE91DD56f921",
    product: "0x2168609301437822c7AD3f35114B10941866F20a",
    usdToken: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59",
  },
};
