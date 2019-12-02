import React from 'react';
import PropTypes from 'prop-types';

import { InformativeInput } from './utils.js';
import { AddSomethingTab } from './addSomethingTab.js';
import { PendingTab, ErrorTab, SuccessTab } from './statusTabs.js';

export { AddPreproTab };

class AddPreproTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "haba",
            targetWidth: "224",
            targetHeight: "224",
            mode: "1"
        };
        this.addPrepro = this.addPrepro.bind(this);
    }

    addPrepro() {
        const preproCfg = this.state;
        this.setState({ status: "waiting" });

        fetch('/add_prepro', {
            method: 'POST',
            body: JSON.stringify(preproCfg),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json() )
        .then(res => {
            if (res.id === undefined) {
                this.setState({ status: "error" });
            } else {
                this.setState({ status: "ok" });
                let preproIdx = this.props.addPrepro(preproCfg);
                if (Number(res.id) !== preproIdx) {
                    console.log("Prepro ids don't match!");
                }
            }
        })
        .catch(error => console.log('Error:', error));
    }

    render() {
        let statusTab = null;
        if (this.state.status === "waiting") {
            statusTab = <PendingTab text="neco dela"/>;
        } else if (this.state.status === "error") {
            statusTab = <ErrorTab text="spatne"/>;
        } else if (this.state.status === "ok") {
            statusTab = <SuccessTab text="hezky"/>;
        }

        return (
            <AddSomethingTab>
            <div>
                <div className="addModelPartLabel">Preprocessor</div>
                <InformativeInput name="name" value={this.state.name} 
                    optional={false}
                    handleChange={(e) => { this.setState({ name: e.target.value }); }}
                />
                <InformativeInput name="target width" value={this.state.targetWidth} 
                    optional={false}
                    handleChange={(e) => { this.setState({ targetWidth: e.target.value }); }}
                />
                <InformativeInput name="target height" value={this.state.targetHeight} 
                    optional={false}
                    handleChange={(e) => { this.setState({ targetHeight: e.target.value }); }}
                />
                <select value={this.state.mode} 
                    onChange={(e) => { this.setState({ mode: e.target.value }); }}>
                        <option value="1" >keep aspect ratio and crop</option>
                        <option value="2" >keep aspect ration and pad</option>
                        <option value="3" >rescale width and rescale height</option>
                        <option value="4" >rescale width and crop/pad height</option>
                        <option value="5" >rescale height and crop/pad width</option>
                </select>
                <br/>
                <button onClick={this.addPrepro}>Add preprocessor</button>
                {statusTab}
            </div>
            </AddSomethingTab>
        );
    }
}

AddPreproTab.propTypes = {
    addPrepro: PropTypes.func.isRequired,
};
