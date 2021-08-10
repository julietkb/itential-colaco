import React from "react"

type Soda = {
  name: string
  description: string
  price: number
  currency: string
  quantity: number
}

function App() {
  const [data, setData] = React.useState<Soda[]>([])

  const getAllSodas = () => {
    fetch("/sodas")
      .then((res) => res.json())
      .then((data) => setData(data.sodas))
  }

  // const getSodaByName = (sodaName: string) => data.filter((soda) => soda.name === sodaName)[0] || null

  React.useEffect(getAllSodas, [])

  const Sodas = () => (
    <div className="grid grid-cols-2 gap-1.5 p-1.5">
      {data.map((soda: Soda) => (
        <div className="flex rounded h-24 w-full text-gray-100 bg-gray-700 justify-center items-center text-center" key={soda.name}>
          {soda.name}
        </div>
      ))}
    </div>
  )

  const Logo = () => <p className="flex rounded bg-gray-400 h-20 justify-center items-center">ColaCo</p>

  const MessageScreen = () => <p className="flex rounded bg-blue-100 h-32 justify-center items-center">message prompt</p>

  const NumberKeypad = () => (
    <div className="grid grid-cols-3 gap-1.5 p-1.5">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
        <button
          className="flex rounded h-6 w-6 bg-gray-400 hover:bg-gray-500 hover:ring-1 hover:ring-gray-700 hover:ring-inset justify-center items-center text-center"
          key={key}
        >
          {key}
        </button>
      ))}
    </div>
  )

  const CTAKeypad = () => (
    <div className="grid grid-cols-1 gap-1.5 p-1.5">
      {["ENTER", "BACK", "EXIT", "ADMIN"].map((key) => (
        <button
          className="rounded pl-1 h-6 w-16 bg-gray-400 hover:bg-gray-500 hover:ring-1 hover:ring-gray-700 hover:ring-inset text-left"
          key={key}
        >
          {key}
        </button>
      ))}
    </div>
  )

  const Dispenser = () => <p className="flex rounded text-gray-100 bg-gray-900 h-12 justify-center items-center">download sodas</p>

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">

      {/* Core ending machine component */}
      <div className="flex flex-row p-3 bg-gray-500 sm:rounded h-full w-full sm:h-600px sm:w-400px z-10">
        <div className="rounded mr-1.5 h-3/4 w-1/2 bg-gray-400 overflow-scroll">
          <Sodas />
        </div>
        <div className="rounded ml-1.5 h-full w-1/2">
          <div className="grid grid-cols-1 gap-3">
            <Logo />
            <MessageScreen />
            <div className="flex flex-wrap rounded py-1 bg-gray-600 justify-center items-center">
              <NumberKeypad />
              <CTAKeypad />
            </div>
            <Dispenser />
          </div>
        </div>
      </div>

      {/* "Legs" of the vending machine for desktops and tablets; these are non-functional and only exist for UI */}
      <div className="hidden sm:flex sm:flex-row sm:-mt-1.5 sm:justify-between sm:w-400px">
        <div className="rounded w-3 h-6 bg-gray-900"></div>
        <div className="rounded w-3 h-6 bg-gray-900"></div>
      </div>

    </div>
  )
}

export default App