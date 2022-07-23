var HousingERC721Token = artifacts.require('HousingERC721Token');

contract('Real Estate Housing ERC721Token tests', accounts => {

    let contract;
    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            contract = await HousingERC721Token.new({from: account_one});

            // TODO: mint multiple tokens
            await contract.mint(account_one, 1, { from: account_one });
            await contract.mint(account_one, 2, { from: account_one });
            await contract.mint(account_two, 3, { from: account_one });
        })

        it('check total supply', async function () { 
            let totalSupply = await contract.totalSupply.call();
            assert.equal(3, totalSupply, "3 tokens should be minted.");
        })

        it('check token balance', async function () { 
            let balanceOne = await contract.balanceOf.call(account_one);
            assert.equal(2, balanceOne, "Account_one should have 2 tokens.");
            let balanceTwo = await contract.balanceOf.call(account_two);
            assert.equal(1, balanceTwo, "Account_two should have 1 token.");
        })

        it('check token uri', async function () { 
            let tokenUriOne = await contract.tokenURI.call(1);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", tokenUriOne, "token(1) URI is not correct.");
            let tokenUriTwo = await contract.tokenURI.call(2);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", tokenUriTwo, "token(2) URI is not correct.");
            let tokenUriThree = await contract.tokenURI.call(3);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3", tokenUriThree, "token(3) URI is not correct.");
        })

        it('transfer token from one owner to another', async function () { 
            
            try 
            {
                await contract.transferFrom(account_one, account_two, 2, { from: account_one });
            }
            catch(e) {
                console.log('TransferFrom failed.', e);
            }
            let ownerOfOne = await contract.ownerOf.call(1);
            assert.equal(account_one, ownerOfOne, "token(1) owner is not correct.");
            let ownerOfTwo = await contract.ownerOf.call(2);
            assert.equal(account_two, ownerOfTwo, "token(2) owner is not correct");
            let ownerOfThree = await contract.ownerOf.call(3);
            assert.equal(account_two, ownerOfThree, "token(3) owner is not correct.");
        })
    });

    describe('check ownership properties', function () {
        beforeEach(async function () { 
            contract = await HousingERC721Token.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
            let accessDenied = false;
            try  {
                await contract.mint(account_one, 4, { from: account_two });
            } catch(e) {
                accessDenied = true;
            }
            assert.equal(true, accessDenied, "this account should not be able to mint.");
            let balanceTwo = await contract.balanceOf.call(account_two);
            assert.equal(0, balanceTwo, "this account should have 0 balance");
        })

        it('should return contract owner', async function () { 
            let owner = await contract.getOwner.call();
            assert.equal(account_one, owner, "account_one. should be owner");
        })

    });
})