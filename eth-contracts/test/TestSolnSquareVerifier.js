var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var HousingERC721Token = artifacts.require('HousingERC721Token');

contract('TestSolnSquareVerifier', async(accounts) => {
    beforeEach(async function () { 
      this.solnSquareVerifier = await SolnSquareVerifier.new({from: accounts[0]});
      this.contract = await HousingERC721Token.new({from: accounts[0]});  
    });

    it('contract can add a new solution', async function () { 
        let a = ["0x1ba0df5159c4c75da8a30d34e28b0a2242b9634aed77c9b41b979e6081ed5033",
                    "0x04a81e18c8c57362b000213bce6d533055ba4f830dc76abf9c5bf37907ffbdd0"];

        let b = [
            ["0x272c1132c59a11b904df2e3921eaf7b40ce948a1a24e9b36dd6e2e04cc3e9560",
            "0x1535e1e6c5cb4d685ef68595487910d68d8813765f422b977b53e32f8c53fc94"],
            ["0x26e8a26d9bd754c038c42bb9b5b32b91a0c1463aba53b03eb8e224f1230f853a",
            "0x2c080f65faca972f26229da56b338fc12d62261f8626ec42659bc1090e7a983d"]
        ];
        let c = ["0x08c833d09a989255fa84bd16e9b4374fbf2c59f92f8b67298771b72c03e56f7f",
                "0x2f85944aef8c9f217463077e0d8f85fdf5546b3b570820ade0cf9c95a3feb440"];
        let inputs = ["0x0000000000000000000000000000000000000000000000000000000000000009",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"];

        await this.solnSquareVerifier.add(a, b, c, inputs, {from: accounts[0]});

        let solutions = await this.solnSquareVerifier.solutions(0);
        assert.equal(0, solutions.index, "One solution should be added with index 0.");
        assert.equal(accounts[0], solutions.sender, "One solution should be added by msg.sender.");
    })

    it('contract can mint a token', async function () { 
        let a = ["0x1ba0df5159c4c75da8a30d34e28b0a2242b9634aed77c9b41b979e6081ed5033",
                    "0x04a81e18c8c57362b000213bce6d533055ba4f830dc76abf9c5bf37907ffbdd0"];

        let b = [
            ["0x272c1132c59a11b904df2e3921eaf7b40ce948a1a24e9b36dd6e2e04cc3e9560",
            "0x1535e1e6c5cb4d685ef68595487910d68d8813765f422b977b53e32f8c53fc94"],
            ["0x26e8a26d9bd754c038c42bb9b5b32b91a0c1463aba53b03eb8e224f1230f853a",
            "0x2c080f65faca972f26229da56b338fc12d62261f8626ec42659bc1090e7a983d"]
        ];
        let c = ["0x08c833d09a989255fa84bd16e9b4374fbf2c59f92f8b67298771b72c03e56f7f",
                "0x2f85944aef8c9f217463077e0d8f85fdf5546b3b570820ade0cf9c95a3feb440"];
        let inputs = ["0x0000000000000000000000000000000000000000000000000000000000000009",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"];

        let tokenId = 2;

        await this.solnSquareVerifier.verifyAndMint(a, b, c, inputs, tokenId, {from: accounts[0]});

        let solutions = await this.solnSquareVerifier.solutions(0);
        assert.equal(0, solutions.index, "A solution should be added");

        let totalSupply = await this.solnSquareVerifier.totalSupply.call();
        assert.equal(1, totalSupply, "3 tokens should be minted.");
    })

})