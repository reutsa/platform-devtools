import React, {Component} from 'react';
import './MenuItem.css';
import branch from '../../assets/img/branch.svg';

function taskToBranchName() {
    const toKebabCase = string => string
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
        .join('-')
        .toLowerCase();

    const issueId = document.querySelector('[data-test-id*="current-issue"]').innerText;
    const title = document.querySelector('[data-test-id*="summary"]').innerText;

    if (!issueId || !title) {
        return "no title"
    }

    return `${issueId}-${toKebabCase(title)}`
}

class MenuItemComponent extends Component {
    getBranchName() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currTab = tabs[0];
            if (currTab) {
                chrome.scripting.executeScript(
                    {
                        target: {tabId: currTab.id},
                        func: taskToBranchName,
                    },
                    (results) => {
                        if (results && results.length > 0) {
                            const branchName = results[0].result
                            navigator.clipboard.writeText(branchName);
                            const tooltipElement = document.getElementById("tooltip");
                            tooltipElement.classList.add("show");
                            setTimeout(function () {
                                tooltipElement.classList.remove("show");
                            }, 1000);
                        }
                    }
                );
            }
        });
    }

    render() {
        return (
            <div className="MenuItem" onClick={this.getBranchName}>
                <img src={branch} className="Branch-icon" alt="git branch icon" />
                <div className="Item">Get branch name
                    <span id="tooltip" className="tooltip">Copied!</span>
                </div>
            </div>
        )
    }
}

export default MenuItemComponent;
