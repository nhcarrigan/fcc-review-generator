# freeCodeCamp Review Generator

This tool allows you to compile all of freeCodeCamp's review lessons into a single PDF.

## Usage

1. Clone the repo, `pnpm install`.
2. Go to the freeCodeCamp repo, copy all of the review blocks into the `content` directory here. Nested directories are fine, we walk the file tree recursively. Only markdown files will be parsed.
3. Go to the freeCodeCamp repo, copy the Full Stack order in `/curriculum/structure/superblocks/fullstack.json` to the `data/order.json` here.
4. Run `pnpm start` to start reading the files, compiling them into a single doc, and turning that doc into a PDF.
5. Profit.

## Feedback and Bugs

If you have feedback or a bug report, please feel free to open a GitHub issue!

## Contributing

If you would like to contribute to the project, you may create a Pull Request containing your proposed changes and we will review it as soon as we are able! Please review our [contributing guidelines](CONTRIBUTING.md) first.

## Code of Conduct

Before interacting with our community, please read our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This software is licensed under our [global software license](https://docs.nhcarrigan.com/#/license).

Copyright held by Naomi Carrigan.

## Contact

We may be contacted through our [Chat Server](http://chat.nhcarrigan.com) or via email at `contact@nhcarrigan.com`.
