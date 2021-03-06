import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames, CharacterStatus } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface DishonorProperties extends CardActionProperties {
}

export class DishonorAction extends CardGameAction {
    name = 'dishonor';
    eventName = EventNames.OnCardDishonored;
    targetType = [CardTypes.Character];
    cost = 'dishonoring {0}';
    effect = 'dishonor {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.location !== Locations.PlayArea || card.type !== CardTypes.Character || card.isDishonored) {
            return false;
        } else if(!card.isHonored && !card.checkRestrictions('receiveDishonorToken', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event): void {
        event.card.dishonor()
        if (event.card.isDishonored) {
            event.card.game.raiseEvent(EventNames.OnStatusTokenGained, { token: event.card.getStatusToken(CharacterStatus.Dishonored), card: event.card });
        }
    }
}
