# Progress favicon

## Usage

Instanciate `FaviconLoading` with options

### type

value: `pie` | `donut`

### message

value: *string*

if empty string, the original title of the page is kept in the browser tab. Use following variables

* `{{percent}}`: percentage of the progress
* `{{progress}}`: Current value of the progress
* `{{max}}`: Max value of the progress (default: 100)

## Changing progress

``` typescript

    window.progressFaviconInstance = new FaviconLoading({
        type: 'pie',
        message: 'foo {{percent}}'
    });

    window.progressFaviconInstance.max = 360;
    window.progressFaviconInstance.progress = 50;

```
