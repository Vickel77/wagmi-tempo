import { useConnect, useConnection, useConnectors, useDisconnect, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config'
import { Hooks } from 'wagmi/tempo'

const queryClient = new QueryClient()

function App() {
  const connect = useConnect()
  const connectors = useConnectors()
  const [connector] = connectors
  const disconnect = useDisconnect()
  const account = useConnection()
  const create = Hooks.token.useCreateSync()
  const { address } = useConnection()
  const addFunds = Hooks.faucet.useFund()

  // Error state
  if (connect.error) {
    return (
      <div className="app-container">
        <div className="card">
          <div className="error-message">
            Error: {connect.error.message}
          </div>
          <button 
            className="button button-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (connect.isPending) {
    return (
      <div className="app-container">
        <div className="card">
          <div className="loading-state">
            Check your wallet prompt...
          </div>
        </div>
      </div>
    )
  }

  // Connected state
  if (account.address) {
    return (
      <WagmiProvider config={config as any}>
        <QueryClientProvider client={queryClient}>
          <div className="app-container">
            {/* Account Info Card */}
            <div className="card">
              <div className="account-info">
                <div>
                  <div className="form-label" style={{ marginBottom: '0.25rem' }}>
                    Connected Account
                  </div>
                  <div className="account-address">
                    {account.address.slice(0, 6)}...{account.address.slice(-4)}
                  </div>
                </div>
                <button 
                  className="button button-secondary"
                  onClick={() => disconnect.disconnect()}
                  style={{ width: 'auto', margin: 0, padding: '0.625rem 1.25rem' }}
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Actions Card */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Wallet Actions</h2>
              </div>
              
              <div className="button-group">
                <button 
                  className="button button-primary"
                  onClick={() => addFunds.mutate({ account: address! })}
                  disabled={addFunds.isPending}
                >
                  {addFunds.isPending ? 'Processing...' : 'Add Funds'}
                </button>
              </div>
            </div>

            {/* Create Token Card */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Create Token</h2>
                <p className="card-subtitle">Create a new token on Tempo</p>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  const formData = new FormData(event.target as HTMLFormElement)
                  const name = formData.get('name') as string
                  const symbol = formData.get('symbol') as string

                  create.mutate({
                    name,
                    symbol,
                    currency: 'USD',
                  })
                }}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Token Name
                  </label>
                  <input 
                    id="name"
                    type="text" 
                    name="name" 
                    className="input"
                    placeholder="e.g., demoUSD" 
                    required 
                    disabled={create.isPending}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="symbol">
                    Token Symbol
                  </label>
                  <input 
                    id="symbol"
                    type="text" 
                    name="symbol" 
                    className="input"
                    placeholder="e.g., DEMO" 
                    required 
                    disabled={create.isPending}
                  />
                </div>

                <button 
                  type="submit"
                  className="button button-primary"
                  disabled={create.isPending}
                >
                  {create.isPending ? 'Creating Token...' : 'Create Token'}
                </button>
              </form>

              {create.data && (
                <div className="success-message">
                  <div className="success-message-title">
                    ✓ {create.data.name} created successfully!
                  </div>
                  <a 
                    href={`https://explore.tempo.xyz/tx/${create.data.receipt.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="success-link"
                  >
                    View Transaction →
                  </a>
                </div>
              )}

              {create.error && (
                <div className="error-message" style={{ marginTop: '1.5rem' }}>
                  Error: {create.error.message || 'Failed to create token'}
                </div>
              )}
            </div>
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    )
  }

  // Sign in/up state
  return (
    <WagmiProvider config={config as any}>
      <QueryClientProvider client={queryClient}>
        <div className="app-container">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Welcome</h1>
              <p className="card-subtitle">Connect your wallet to get started</p>
            </div>

            <div className="button-group">
              <button
                className="button button-primary"
                onClick={() =>
                  connect.connect({
                    connector,
                    // capabilities: { type: 'sign-up' },
                  })
                }
                disabled={connect.isPending}
              >
                Sign Up
              </button>

              <button 
                className="button button-secondary"
                onClick={() => connect.connect({ connector })}
                disabled={connect.isPending}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
