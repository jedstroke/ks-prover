// OPEN SOURCE - The public Kitchen Sink Prover CLI

import { hash } from 'starknet';
import { Buffer } from 'buffer';
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';

const program = new Command();

// Rebuilds the exact same 31-byte chunks used by the author
function stringToFelts(str: string): bigint[] {
    const buffer = Buffer.from(str, 'utf-8');
    const felts: bigint[] = [];
    for (let i = 0; i < buffer.length; i += 31) {
        const chunk = buffer.subarray(i, Math.min(i + 31, buffer.length));
        felts.push(BigInt("0x" + chunk.toString('hex')));
    }
    return felts;
}

program
    .name('kitchen-sink')
    .description('Cryptographic proof of the author\'s original intent and integrity.');

program
    .command('verify')
    .argument('<file>', 'Path to the revealed snapshot.json')
    .action((file) => {
        let data;
        try {
            data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        } catch (e) {
            console.error(chalk.red("Failed to read snapshot file."));
            process.exit(1);
        }

        console.log(chalk.yellow('\n--- 🚰 KITCHEN SINK INTEGRITY VERIFICATION ---\n'));
        console.log(chalk.dim('If the computed hashes do not match the author\'s timestamped commitments,'));
        console.log(chalk.dim('the data has been tampered with, and the author\'s integrity is broken.\n'));

        let allValid = true;

        data.poems.forEach((poem: any) => {
            // EXACT SAME 1-to-1 Mapping as the generator: [poemId, ...textChunks, rewardId, salt]
            const payload = [
                BigInt(poem.tokenId),
                ...stringToFelts(poem.text),
                BigInt(poem.rewardId),
                BigInt(poem.salt)
            ];

            // computePoseidonHashOnElements natively returns the hex string (0x...)
            const computedHash = hash.computePoseidonHashOnElements(payload);

            console.log(`Poem #${poem.tokenId}: ${chalk.bold(poem.title)}`);
            console.log(`  Reward Token ID: ${poem.rewardId}`);
            console.log(`  Computed Hash:   ${chalk.bold.cyan(computedHash)}`);

            if (poem.expectedHash) {
                // Lowercase both for a safe comparison
                if (computedHash.toLowerCase() === poem.expectedHash.toLowerCase()) {
                    console.log(`  Status:          ${chalk.green('✓ INTEGRITY VERIFIED')}\n`);
                } else {
                    console.log(`  Status:          ${chalk.red('✗ TAMPERING DETECTED')}\n`);
                    allValid = false;
                }
            } else {
                console.log(`  Status:          ${chalk.dim('Compare manually with original tweet')}\n`);
            }
        });

        if (data.poems[0].expectedHash && !allValid) {
            console.log(chalk.bgRed.white('\n WARNING: ONE OR MORE HASHES FAILED INTEGRITY CHECK '));
            process.exit(1);
        }
    });

program.parse();