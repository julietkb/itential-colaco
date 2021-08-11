import React from "react"
import cn from "classnames"
import { GiSodaCan as SodaIcon } from "react-icons/gi"

type Soda = {
  code: string
  name: string
  color: string
  description: string
  price: number
  currency: string
  quantity: number
}

type Message = {
  message: string
  prompt?: string
}

const messages = {
  welcome: {
    message: "Welcome to ColaCo! Please look up a soda's price & quantity by entering its code or press ADMIN."
  },
  lookup: { message: "Press ENTER to search soda with code " },
  searchResults: { message: "", prompt: "ENTER to buy, BACK to continue search" },
  searchResultsError: { message: "That soda code does not exist. Please try again with another code." },
  buying: { message: "Enter the quantity you would like to purchase.", prompt: "Selected quantity: " },
  quantityError: { message: "You entered an invalid quantity. Please try again." },
}

enum CTA {
  ENTER = "ENTER",
  BACK = "BACK",
  EXIT= "EXIT",
  ADMIN = "ADMIN",
}

const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"]

const ctaKeys = Object.values(CTA).map((cta) => cta as string)

const App = () => {
  const [data, setData] = React.useState<Soda[]>([])
  const [screen, setScreen] = React.useState<Message>(messages.welcome)
  const [keypadDisabled, setKeypadDisabled] = React.useState<boolean>(false)
  const [searchInput, setSearchInput] = React.useState<string>("")
  const [quantityInput, setQuantityInput] = React.useState<string>("")
  const [selectedSoda, setSelectedSoda] = React.useState<Soda>()

  const getAllSodas = () => {
    fetch("/sodas")
      .then((res) => res.json())
      .then((data) => setData(data.sodas))
  }

  const getSodaByCode = (code: string) => data.filter((soda) => soda.code === code)[0] || null

  React.useEffect(getAllSodas, [])

  const handleKeypadClick = (key: string) => {
    console.log("pressed ", key)
    if (key === CTA.EXIT) {
      setSearchInput("")
      setScreen(messages.welcome)
    } else if (screen === messages.welcome) {
      if (!ctaKeys.includes(key)) {
        if (screen !== messages.lookup) setScreen(messages.lookup)
        if (searchInput.length < 10) setSearchInput(searchInput + key)
      }
    } else if (screen === messages.lookup) {
      if (key === CTA.BACK) {
        const newCode = searchInput.substring(0, searchInput.length - 1)
        setSearchInput(newCode)
        if (newCode.length === 0) setScreen(messages.welcome)
      } else if (key === CTA.ENTER) {
        const searchResult = getSodaByCode(searchInput)
        if (searchResult) {
          setSelectedSoda(searchResult)
          setScreen(messages.searchResults)
        } else {
          setScreen(messages.searchResultsError)
          setKeypadDisabled(true)
          setSearchInput("")
          setTimeout(() => {
            setScreen(messages.welcome)
            setKeypadDisabled(false)
          }, 2000);
        }
      } else if (!ctaKeys.includes(key)) {
        if (searchInput.length < 10) setSearchInput(searchInput + key)
      }
    } else if (screen === messages.searchResults) {
      if (key === CTA.BACK) setScreen(messages.lookup)
      if (key === CTA.ENTER) setScreen(messages.buying)
    } else if (screen === messages.buying) {
      if (key === CTA.BACK) {
        const newQuantity = quantityInput.substring(0, quantityInput.length - 1)
        setQuantityInput(newQuantity)
        if (newQuantity.length === 0) setScreen(messages.searchResults)
      } else if (key === CTA.ENTER) {
        if (selectedSoda && parseInt(quantityInput, 10) <= selectedSoda.quantity) {
          console.log("Todo: Buy the soda")
        } else {
          setScreen(messages.quantityError)
          setKeypadDisabled(true)
          setSearchInput("")
          setTimeout(() => {
            setScreen(messages.buying)
            setKeypadDisabled(false)
          }, 2000);
        }
      } else if (!ctaKeys.includes(key) && typeof parseInt(key, 10) === 'number') {
        if (quantityInput.length < 10) setQuantityInput(quantityInput + key)
      }
    }
  }

  const Sodas = () => (
    <div className="grid grid-cols-2 gap-1.5 p-1.5">
      {data.map((soda: Soda) => (
        <div className="flex flex-col rounded h-24 w-full text-gray-100 bg-gray-700 justify-between items-center text-center" key={soda.name}>
          <div className="relative flex h-full w-full justify-center items-center">
            <SodaIcon color={`#${soda.color || "FFF"}`} size="3em"/>
            <p className="absolute text-xs font-bold shadow w-full bg-opacity-20 bg-gray-200">{soda.name}</p>
          </div>
          <div className="flex px-1.5 w-full justify-between bg-gray-800">
          <p className="text-xs">CODE</p>
          <p className="text-xs">{soda.code}</p>
          </div>
        </div>
      ))}
    </div>
  )

  const Logo = () => <p className="flex rounded bg-gray-400 h-20 text-gray-100 text-2xl font-bold shadow justify-center items-center">ColaCo</p>

  const MessageScreen = () => {
    if (screen === messages.searchResults) {
      return (
        <div className="flex flex-col h-full justify-between">
          <p className="text-xs">{selectedSoda?.name}: {selectedSoda?.description} {selectedSoda?.quantity} available. Costs {selectedSoda?.price} {selectedSoda?.currency}.</p>
          <p className="text-xs italic">{screen.prompt}</p>
        </div>
      )
    } else if (screen === messages.lookup) {
      return <p className="text-md">{screen.message} {searchInput.length > 0 && searchInput}</p>
    } else if (screen === messages.buying) {
      return (
        <div className="flex flex-col h-full justify-between">
          <p className="text-md">{screen.message}</p>
          <p className="text-md">{screen.prompt} {quantityInput.length > 0 && quantityInput}</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full justify-between">
        <p className="text-md">{screen.message}</p>
        {screen.prompt && <p className="text-xs italic">{screen.prompt}</p>}
      </div>
    )
  }

  const NumberKeypad = () => (
    <div className="grid grid-cols-3 gap-1.5 p-1.5">
      {numberKeys.map((key) => (
        <button
          className="flex rounded h-6 w-6 bg-gray-400 hover:bg-gray-500 hover:ring-1 hover:ring-gray-700 hover:ring-inset justify-center items-center text-center"
          disabled={keypadDisabled}
          key={key}
          onClick={() => handleKeypadClick(key as string)}
        >
          {key}
        </button>
      ))}
    </div>
  )

  const CTAKeypad = () => (
    <div className="grid grid-cols-1 gap-1.5 p-1.5">
      {ctaKeys.map((key) => (
        <button
          className="rounded pl-1 h-6 w-16 bg-gray-400 hover:bg-gray-500 hover:ring-1 hover:ring-gray-700 hover:ring-inset text-left"
          disabled={keypadDisabled}
          key={key}
          onClick={() => handleKeypadClick(key as string)}
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
            <div className={cn("flex flex-col p-1.5 rounded bg-blue-100 h-32 items-center", {"justify-between": screen.prompt, "justify-center": !screen.prompt})}>
              <MessageScreen />
            </div>
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