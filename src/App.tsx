import React, { useState } from 'react';
import { Lock, Unlock, X, HelpCircle, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init("9NPHmU5LY95y-zc4s");

const CLUES = {
  '123': {
    clue: 'Look behind the coffee machine in the break room! 🍵',
    hint: 'The coffee machine has a secret compartment on its right side that most people don\'t notice...'
  },
  '234': {
    clue: 'Check under the potted plant near the reception desk! 🪴',
    hint: 'Look for the plant with yellow flowers - it\'s the only one that can be safely moved.'
  },
  '345': {
    clue: 'The next clue is taped underneath the conference room table! 📝',
    hint: 'Check the main conference room on the first floor - specifically near the power outlets.'
  },
  '456': {
    clue: 'Visit Sarah in HR, she has something for you! 👋',
    hint: 'Sarah\'s office hours are 10-11 AM and 2-3 PM. She\'ll be expecting you!'
  },
  '567': {
    clue: 'Congratulations! The final prize is in the supply closet on the 2nd floor! 🎉',
    hint: 'The supply closet has a keypad - try using today\'s date as the code!'
  }
};

const TEAMS = [
  'Team Alpha',
  'Team Beta',
  'Team Gamma',
  'Team Delta',
  'Team Epsilon'
];

function App() {
  const [passcode, setPasscode] = useState('');
  const [currentClue, setCurrentClue] = useState('');
  const [error, setError] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) {
      setError(true);
      return;
    }

    const clueData = CLUES[passcode as keyof typeof CLUES];
    
    if (clueData) {
      setCurrentClue(clueData.clue);
      setCurrentHint(clueData.hint);
      setShowClue(true);
      setError(false);
    } else {
      setError(true);
      setShowClue(false);
    }
  };

  const resetForm = () => {
    setPasscode('');
    setCurrentClue('');
    setShowClue(false);
    setError(false);
    setShowHint(false);
    setCurrentHint('');
  };

  const handlePurchaseHint = async () => {
    setIsLoading(true);
    try {
      await emailjs.send(
        'service_al1yt6t',
        'template_ucbwy6o',
        {
          to_email: 'ashish@elenjicalsolutions.com',
          team_name: selectedTeam,
          passcode: passcode,
          hint_purchased: 'yes'
        }
      );
      setShowHint(true);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
            {showClue ? (
              <Unlock className="w-8 h-8 text-orange-600" />
            ) : (
              <Lock className="w-8 h-8 text-orange-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Company Scavenger Hunt
          </h1>
          <p className="text-gray-600">
            Enter your passcode to unlock the next clue!
          </p>
        </div>

        {!showClue ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select your team</option>
                {TEAMS.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-2xl tracking-widest`}
                placeholder="Enter passcode"
                maxLength={3}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">
                  {!selectedTeam 
                    ? 'Please select your team first.'
                    : 'Invalid passcode. Please try again.'}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200"
            >
              Unlock Clue
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-gray-800 text-lg text-center">{currentClue}</p>
            </div>
            
            {!showHint && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <p className="text-blue-800 font-medium">Need a hint?</p>
                  </div>
                  <span className="text-blue-600 font-semibold">$5.00</span>
                </div>
                <button
                  onClick={handlePurchaseHint}
                  disabled={isLoading}
                  className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Purchase Additional Hint
                    </>
                  )}
                </button>
              </div>
            )}

            {showHint && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium">Additional Hint:</p>
                </div>
                <p className="text-gray-800">{currentHint}</p>
              </div>
            )}

            <button
              onClick={resetForm}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
              Close Clue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;