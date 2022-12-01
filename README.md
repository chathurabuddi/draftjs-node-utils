## DraftJs Node Utils

[![ISC Licence](https://img.shields.io/github/license/chathurabuddi/draftjs-node-utils)](https://github.com/chathurabuddi/draftjs-node-utils/blob/master/LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=chathurabuddi_draftjs-node-utils&metric=alert_status)](https://sonarcloud.io/dashboard?id=chathurabuddi_draftjs-node-utils)
[![codecov](https://codecov.io/gh/chathurabuddi/draftjs-node-utils/branch/main/graph/badge.svg)](https://codecov.io/gh/chathurabuddi/draftjs-node-utils)
[![Latest Version](https://img.shields.io/github/v/release/chathurabuddi/draftjs-node-utils)](https://github.com/chathurabuddi/draftjs-node-utils/releases/latest)

This library provides a set of utility functions to convert draftJs content in a Node JS environment without browser dependencies.  
_Implementation was extracted from [sstur/draft-js-utils](https://github.com/sstur/draft-js-utils) and modified_

### Installation & Usage
Use npm to install the package. Alternatively you can find the latest downloads on the [release page](https://github.com/chathurabuddi/draftjs-node-utils/releases).

```bash
$ npm install draftjs-node-utils
```

__1. Convert HTML to DraftJS__
```javascript
import draftJs from 'draft-js';
import { htmlToDraftJs } from "draftjs-node-utils";

const contentState = htmlToDraftJs(html);
const draftJsRaw = draftJs.convertToRaw(contentState);
```

### Issues
Please make sure to read the
[issue reporting checklist](https://github.com/chathurabuddi/draftjs-node-utils/blob/main/CONTRIBUTING.md#issue-reporting-guidelines)
before opening an issue. Issues not conforming to the guidelines may be closed immediately.

### Changelog
Detailed changes for each release are documented in the [release notes](https://github.com/chathurabuddi/draftjs-node-utils/releases).

### Contribution
Contributions, issues and feature requests are welcome. Feel free to check
[issues page](https://github.com/chathurabuddi/draftjs-node-utils/issues)
if you want to contribute. Please make sure to read the
[contributing guide](https://github.com/chathurabuddi/draftjs-node-utils/blob/main/CONTRIBUTING.md)
before making a pull request.

### License
Copyright © 2022 Chathura Buddhika ([chathurabuddi](http://chathurabuddi.lk))  
This project is [ISC](http://opensource.org/licenses/ISC) licensed.
