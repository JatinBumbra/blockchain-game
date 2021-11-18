import { useEffect, useState } from 'react';
import Web3 from 'web3';
import questions from '../data/questions';
import GameContract from '../build/contracts/Game.json';
import TokenContract from '../build/contracts/Token.json';

const initAlert = {
  color: '',
  message: '',
  dismissable: false,
};

export default function Home() {
  const [account, setAccount] = useState({
    address: '0x00',
    rewards: 0,
  });
  const [game, setGame] = useState();

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeOption, setActiveOption] = useState();
  const [answersGiven, setAnswersGiven] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const [contractsLoaded, setContractsLoaded] = useState(false);

  const [rewards, setRewards] = useState(false);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(initAlert);

  useEffect(() => {
    resetUI();
    window.ethereum.on(
      'accountsChanged' || 'chainChanged',
      function (accounts) {
        resetUI();
      }
    );
  }, []);

  useEffect(() => {
    // alert.message &&
    alert.dismissable && setTimeout(() => setAlert(initAlert), 5000);
  }, [alert]);

  const resetUI = () => {
    setActiveQuestionIndex(0);
    setActiveOption();
    setAnswersGiven([]);
    setIsQuizCompleted(false);
    setLoading(false);
    setAlert(initAlert);
    setContractsLoaded(false);
    loadWeb3().then(loadBlockchainData).finally(setLoading);
  };

  const loadWeb3 = async () => {
    setLoading(true);
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      setAlert({
        color: 'red',
        message: 'Non-Etherium browser detected. Try MetaMask',
        dismissable: false,
      });
    }
  };

  const loadBlockchainData = async () => {
    // Load web3
    const web3 = window.web3;
    if (!web3) return;
    // Data vars
    let rewards, address;
    // Get account address
    const accounts = await web3.eth.getAccounts();
    address = accounts[0];
    // Get active network id
    const netId = await web3.eth.net.getId();
    // Load token contract
    const tokenData = TokenContract.networks[netId];
    if (tokenData) {
      const tokenContract = new web3.eth.Contract(
        TokenContract.abi,
        tokenData.address
      );
      const r = await tokenContract.methods.balanceOf(address).call();
      rewards = web3.utils.fromWei(r.toString());
    }
    // Load game contract
    const gameData = GameContract.networks[netId];
    if (gameData) {
      const gameContract = new web3.eth.Contract(
        GameContract.abi,
        gameData.address
      );
      setGame(gameContract);
    }
    // If tokens are not deployed, then show error
    if (!tokenData || !gameData) {
      setAlert({
        color: 'red',
        message:
          'Contracts not deployed to this network. Switch to Ropsten Network.',
        dismissable: false,
      });
    }
    if (tokenData && gameData) {
      setContractsLoaded(true);
    }

    setAccount((prev) => ({ ...prev, rewards, address }));
  };

  const handleNext = (e) => {
    if (activeQuestionIndex === questions.length - 1) {
      setIsQuizCompleted(true);
      // Get the no. of correct answers
      const correctAns = answersGiven.filter(
        (ans, i) => ans == questions[i].answer
      ).length;
      // If all 5 are correct, reward 100 tokens, else reward 5 tokens for each correct answer
      setRewards(correctAns * 5);
      return;
    }
    setActiveQuestionIndex((prev) => prev + 1);
    setActiveOption();
  };

  const handleSelected = (e) => {
    if (activeOption) return;
    setActiveOption(e.target.id);
    setAnswersGiven((prev) => [...prev, e.target.id]);
  };

  const handleRewards = async () => {
    if (!contractsLoaded)
      return setAlert({
        color: 'red',
        message:
          'Contracts not deployed to this network. Switch to Ropsten Network.',
        dismissable: false,
      });
    if (alert.message) return;
    setLoading(true);
    try {
      await game.methods
        .issueRewards(web3.utils.toWei(rewards.toString()))
        .send({ from: account.address });
      await loadBlockchainData();
      resetUI();
      setAlert({
        color: 'green',
        message: 'You have received the rewards',
        dismissable: true,
        isSuccess: true,
      });
      // Pay user the rewards
    } catch (error) {
      setAlert({
        color: 'red',
        message: error.message,
        dismissable: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='h-screen overflow-hidden'>
      <p className='bg-red-500'></p>
      <p className='bg-green-500'></p>
      {loading ? (
        <p className='bg-yellow-500 text-white p-1 text-sm text-center'>
          Loading...
        </p>
      ) : null}
      {alert.message ? (
        <div
          className={`bg-${alert.color}-500 text-white text-center text-sm p-1`}
        >
          {alert.message}
        </div>
      ) : null}
      {/* Grid */}
      <div className='grid grid-cols-2'>
        {/* Hero Section */}
        <div className='p-10 pr-20'>
          {/* Header */}
          <header className='py-3 flex justify-between'>
            <p className='text-2xl font-medium'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 font-black'>
                Blockchain
              </span>
              <span className='text-gray-400'> Quiz</span>
            </p>
          </header>
          <h1 className='text-8xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 font-black mt-6'>
            Learn and Earn
          </h1>
          <h2 className='text-xl text-gray-400 font-semibold mt-3 mb-20'>
            Test your knowledge on Blockchain Technology and earn KIT tokens for
            the ones you know.
          </h2>
          <p className='text-xl font-semibold text-blue-400'>
            <span className='text-gray-600'>Rewards Earned: </span>
            {account.rewards} KIT
          </p>
          <p className='text font-semibold text-blue-300'>
            <span className='text-gray-400'>Your Account: </span>
            {account.address}
          </p>
        </div>
        {/* Questions */}
        <div className='bg-gradient-to-r from-blue-400 to-indigo-500 h-screen overflow-y-scroll'>
          <div className='m-10 bg-white rounded-2xl p-5 shadow-2xl'>
            {isQuizCompleted ? (
              <div>
                <h3 className='text-3xl font-bold text-gray-900 mb-4 mt-2'>
                  Here are your Results
                </h3>
                {questions.map((qt, i) => (
                  <div className='mb-8' key={i}>
                    <p className='text-gray-500'>{qt.question}</p>
                    <div className='mt-2'>
                      <p className='text-gray-900 font-semibold text-xs mb-1 ml-1'>
                        Correct
                      </p>
                      <div className='border px-4 py-3 rounded-md bg-green-100 border-green-500'>
                        {qt.options[qt.answer]}
                      </div>
                    </div>
                    <div className='mt-3'>
                      <p className='text-gray-900 font-semibold text-xs mb-1 ml-1'>
                        Your Answer
                      </p>
                      <div
                        className={`border px-4 py-3 rounded-md bg-${
                          qt.answer == answersGiven[i] ? 'green' : 'red'
                        }-100 border-${
                          qt.answer == answersGiven[i] ? 'green' : 'red'
                        }-500`}
                      >
                        {qt.options[answersGiven[i]]}
                      </div>
                    </div>
                  </div>
                ))}
                <p className='text-2xl font-semibold text-gray-900'>
                  Your Rewards: {rewards} KIT
                </p>
                <button
                  className='text-white bg-indigo-500 py-2 px-6 rounded-md hover:bg-indigo-600 active:bg-indigo-700 justify-self-center w-full mt-4 disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={handleRewards}
                  disabled={loading}
                >
                  Get Rewards
                </button>
              </div>
            ) : (
              <div>
                <p className='text-gray-400 font-medium mb-3'>
                  Question {activeQuestionIndex + 1} / 5
                </p>
                <h2 className='text-lg text-gray-900 font-medium mb-4'>
                  {questions[activeQuestionIndex].question}
                </h2>
                {questions[activeQuestionIndex].options.map((op, i) => (
                  <div
                    id={i}
                    className={`border px-4 py-3 my-3 cursor-pointer rounded-md ${
                      activeOption && i == questions[activeQuestionIndex].answer
                        ? 'bg-green-100 border-green-500'
                        : ''
                    } ${
                      activeOption != questions[activeQuestionIndex].answer &&
                      i == activeOption
                        ? 'bg-red-100 border-red-500'
                        : ''
                    }`}
                    key={op}
                    onClick={handleSelected}
                  >
                    {op}
                  </div>
                ))}
                <button
                  className='text-white bg-indigo-500 py-2 px-6 rounded-md hover:bg-indigo-600 active:bg-indigo-700 justify-self-center w-full mt-4 disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={handleNext}
                  disabled={activeOption === undefined}
                >
                  {activeQuestionIndex === questions.length - 1
                    ? 'View Results'
                    : 'Next'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
