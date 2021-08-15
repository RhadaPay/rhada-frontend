# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Generate Typings for PaymentFactory.json
```
npm run typechain
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# A Primer on the superfluid protocol #
Our implementation of superfluid is initialised in a deployed
smart contract, exported in the ./ethers file as 'cashflowFactory'

### Parameters ###
When a job is finalised, the cashflowFactory works behind the scenes
to create an adjustable flow. There are a few addresses to keep in mind:
@param senderAddress, this is the wallet address of the account where money
should be transferred from (Mark, the entrepreneur)
 
* @param recipientAddress this is the wallet of the account where the money should ultimately end up (Carey, the developer)
 
* @param cashflowRecipientAddress this is the mediation contract, created automatically by the cashflow factory. This handles stream adjustments between both parties.
 
* @const SUPERTOKEN_ADDRESS this is a given value for the super tokens used as part of the superfluid protocol. There are different addresses depending on what network you deploy on:

https://docs.superfluid.finance/superfluid/networks/networks

As of time of writing we are using the matic mumbai fDAIx supertoken 

* @param jobId this is the numerical identifier (position in the jobs array) of the 
current job.
 
* @param flowRate this is an amount in DAIx per second. It's a big number and the formula to
to DAIx per second is found in this link:
https://docs.superfluid.finance/superfluid/docs/subgraph#how-much-usdcx-has-alice-streamed


### How does it work ###
https://docs.superfluid.finance/superfluid/protocol-tutorials/frontend-+-nodejs#set-up

### Workflow ###
* @step1 Fetch the parameters for a given @jobId
* @step2 Initialise the superfluid client, passing in the provider from metamask and
   the SUPERTOKEN_ADDRESS. 
* @step3 Setup the flow from the sender to the cashflow address
* @step4 Use the query in the ./theGraph file to validate the stream has started
     * @param owner - same as above
     * @param recipient - the final recipient, not the cashflow factory
     You can hit this query on repeat to keep updating the DOM with the latest values 
### GOTCHAS ###
*  Recipient address needs to be the cashflow and *not* the end recipient, this is require
   in order to adjust the cashflows in response to events 
*  Make sure all steps are completed before starting a flow -> this includes the finalSign
   which is really important as it initialises the flow 
*  fDAIx token. If doing this manually, you need to make a one off send of 1 DAIx to the c
   This is required by the protocol 
*  Flow rates. There is a minimum flow required to start a superfluid flow. As we are mediating with a smart contract, the minimum flow rate is doubled. For the demo, we've hardcoded 750 DAI per month initially, so the flow rate is set to 1500 DAI per month. Note that the sender automatically recieves half the flow back so the initial stream the sender sees is only 750 DAIx per month
  
* Super DAI balance: ensure the sending account has adequate funds to begin the payment - these can be obtained from superfluid