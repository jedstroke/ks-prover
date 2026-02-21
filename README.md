<div align="center">
  <img src="https://avatars.githubusercontent.com/u/135972697?s=400&u=e14969fbbd26382f69f0be425c234e846b3bd8b8&v=4" alt="Kitchen Sink Prover" />
</div>

# **Kitchen Sink Prover |-/** - **$RZN**

> _"Because a kitchen sink to you is not a kitchen sink to me, okay friend?"_

**Kitchen Sink Prover** is an open-source cryptographic verifier. It is designed to prove the absolute integrity and inseparability of a creator and their creation.

**Contract Address** of **$RZN** a BondingCurveERC721: https://voyager.online/nft-contract/0x07299ecB00B90eC2eaF50D25f6C35eF401a5386f8806a0e955A270D29D934439

## Video Demo

[Watch the project demo](https://github.com/jedstroke/ks-prover/raw/refs/heads/main/demo.mp4)

## The Philosophy: Vulnerability & Integrity

Creating art—true, raw art—often involves an inner meaning or journey that only the author understands. In this project, three poems (_Kanye Affection_, _When They Left_, and _Mono No Aware_) as seen here: https://taveo.jedshock.com/ are paired with private, gated reflections (the "paratext"). These reflections contain the unedited, unpolished truth behind the art.

Being vulnerable itself can be risky, but I am choosing to let people see this vulnerability on one condition: their participation in the reveal of the paratexts. This participation shows they actually care enough to witness it. People might participate for different reasons, but ultimately, it unlocks deeply personal anecdotes—raw, real-life reflections detailing my journey into fatherhood and beyond. With such unpolished truth, there is always a temptation to later sanitize it, to change the narrative to appease the audience, or to soften the blow.

**This prover removes that option.** Before the NFTs are sold, the exact phrasing of these vulnerable reflections—down to the last comma and space, tied to their specific Reward NFT Token IDs—is cryptographically hashed. The hashes are anchored publicly.

If the text or the NFT mapping is altered even slightly after the fact, the hashes will not match. The math will fail. The integrity of the author is broken.

---

## ⚙️ The Math: ZK Alignment (Why Poseidon?)

We could have used any standard hash like SHA-256 to prove data integrity. We chose the **Poseidon Hash Function**.

**Why? Because it is strictly ZK-aligned.**

Standard hashes operate on bitwise logic, which is computationally brutal to prove inside Zero-Knowledge circuits. Poseidon, however, operates on **algebraic finite fields**. This CLI takes the raw vulnerability text, breaks it down into 31-byte chunks, converts them into finite field elements, and hashes them alongside the specific NFT Reward ID and a secret salt.

This project is currently a demonstrative use-case for off-chain proving. However, because the data is already formatted into finite fields and hashed via Poseidon, the architecture is entirely future-proofed.

In the future, this can easily evolve into a full ZK-rollup or an intermediary contract setup. An on-chain vault holding NFT revenue could demand an off-chain ZK-proof of this exact Poseidon hash. If the proof fails, the vault stays locked. By aligning with ZK math today, we don't have to rewrite the cryptography tomorrow.

---

## The Architecture: How It Works

This is a **Commit-and-Reveal** scheme.

1. **The Commitment (The Anchor):** The author hashes the raw text, the specific NFT Reward Token ID, and a secret `salt` using `computePoseidonHashOnElements`. These hashes are posted publicly as a social timestamp.
2. **The Lock:** The actual text remains hidden in the backend, tightly coupled to the smart contract state. It is only revealed to the NFT holder when the smart contract purchases reach a certain threshold and the poems are unlocked.
3. **The Reveal (The Snapshot):** The snapshot itself will be **publicly available, but without the paratext**. However, once unlocked, only the NFT holder receives the complete `snapshot.json` containing the raw paratext, the reward token ID (by then the reward is already claimed), and the secret salt.
4. **The Verification:** The holder uses this open-source CLI to verify the poseidon hash of the revealed data locally. If it matches the author's original public commitment, the truth is intact.

---

## 🔍 How to Verify

Do not trust the author's UI. Trust the math. If you have received a `snapshot.json` containing the revealed paratext, follow these steps to verify its integrity.

### Prerequisites

For this verifier to work, you need to have [Node.js](https://nodejs.org/) installed on your computer.

If you **do not** have Node.js installed:

1. Go to the [Node.js official website](https://nodejs.org/).
2. Download and install the LTS (Long Term Support) version for your operating system.
3. Open a new terminal or command prompt to ensure the installation takes effect.

### Step 1: Clone & Install

Once Node.js is installed, clone this open-source verifier to your local machine and install the dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/kitchen-sink-prover.git
cd kitchen-sink-prover
npm install -D typescript tsx @types/node
npm install
```

### Step 2: Run the Prover

Place your revealed `snapshot.json` file in the root directory. Run the verification command:

```bash
npm run verify ./taveo-backend-snapshot-2026-02-20.json
```

OR

```bash
tsx app.ts verify ./taveo-backend-snapshot-2026-02-20.json
```

### Step 3: Read the Output

The CLI will read the raw text, convert it to field elements, re-apply the Token ID and salt, and output the computed hash.

**If the output says:**

- 🟢 **INTEGRITY VERIFIED:** The text you are reading is the exact, unedited vulnerability the author committed to on day one. The specific NFT maps perfectly to the correct poem.
- 🔴 **TAMPERING DETECTED:** The author has changed the text, shifted the NFT rewards, or altered the original meaning. The truth has been compromised.

---

## 📄 Expected Snapshot Format

For transparency, the verifier expects the `snapshot.json` provided by the backend to look exactly like this:

```json
{
  "project": "RZN",
  "poems": [
    {
      "tokenId": 1,
      "title": "Kanye Affection",
      "rewardId": 1,
      "salt": "0x19a4b87f",
      "expectedHash": "0xYourOriginalTweetedHash",
      "text": "The raw string of the paratext goes here..."
    }
  ]
}
```

## **Footnotes:**

📝 Kanye Affection: `0x365e71bac791bd25a6a8341728161c04d3f5b005d9cf047956d201df82dc4f8`

📝 When They Left: `0x317771c712c933da2e4a92ebe9622f5fb460c7cb1ab45f734b54d2d6b555093`

📝 Mono No Aware: `0x37bc785202a5a0601629126cd90649920685a4ebe8ec4aadd248fd377bdf1ff`

Contract Address: `0x7299ecb00b90ec2eaf50d25f6c35ef401a5386f8806a0e955a270d29d934439`

dApp URL: https://taveo.jedshock.com

Inspo: https://genius.com/Twenty-one-pilots-kitchen-sink-lyrics
