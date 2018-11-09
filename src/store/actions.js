export const preloadBehavior = (actionFn) => {

    return (context, payload) =>  {

        context.dispatch('setPreloader', true );

        return new Promise((resolve, rejected) => {

            actionFn.call( this, context, payload)
                .then( (data) => {
                    resolve(data);
                })
                .catch( error => {
                    rejected(error);
                })
                .finally( () => {
                    context.dispatch('setPreloader', false );
                })

        })

    }

};


export default { preloadBehavior };

